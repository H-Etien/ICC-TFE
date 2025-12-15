import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/layout/Header";
import ProjectGrid from "../components/layout/ProjectGrid";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "../styles/customizations";

import KanbanBoard from "../components/kanban/KanbanBoard";
import Divider from "@mui/material/Divider";
import CreateTaskForm from "../components/forms/CreateTaskForm";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";

// Pour le drag and drop
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import PageLayout from "../components/layout/PageLayout";
import useProjects from "../hooks/useProjects";
import useTasks from "../hooks/useTasks";
import api from "../api";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function ProjectDetail(props: { disableCustomTheme?: boolean }) {
    const { id } = useParams<{ id: string }>();
    const { getProjectById, selectedProject } = useProjects();
    const { getTasks, tasks, setTasks, createTask } = useTasks();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
    });

    // Pour le dialogue de confirmation de suppression du projet
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        (async () => {
            if (!id) return;

            try {
                // Pour avoir les détails d'un projet spécifique avec ses Tasks
                await getProjectById(Number(id));
                await getTasks(Number(id));
            } catch (e) {
                console.error(e);
            } finally {
            }
        })();
    }, [id, getProjectById, getTasks]);

    useEffect(() => {
        if (selectedProject) {
            setProjectData({
                title: selectedProject.title,
                description: selectedProject.description,
            });
        }
    }, [selectedProject]);

    console.log(`Tasks from hook in ProjectDetail ${id} :`, tasks);

    // Fonction pour mettre à jour le statut d'une tâche de manière optimiste
    const handleTaskMove = async (
        taskId: number | string,
        newStatus: string
    ) => {
        const previousTasks = tasks;

        // Mise à jour optimiste de l'UI, donc la tâche Task de statut immédiatement
        // et on vérifie les erreurs après
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );

        try {
            await api.patch(`/api/projects/${id}/tasks/${taskId}/`, {
                status: newStatus,
            });
            // Optionnel: re-fetch pour s'assurer de la synchro, mais l'UI est déjà à jour.
            // await getTasks(Number(id));
        } catch (error) {
            console.error("Error updating task status:", error);
            // Revert on error
            setTasks(previousTasks);
        }
    };

    // Pour exporter les tâches du projet en .ics (Google Calendar)
    const handleExportToCalendar = async () => {
        try {
            const response = await api.get(`/api/projects/${id}/tasks/export/`);

            // Créer un lien de téléchargement
            // Blob : Binary Large Object, objet JS pour les données comme fichier, image, ICS ...
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${selectedProject.title}_tasks.ics`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error export tasks:", error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | { name?: string; value: unknown }
        >
    ) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name as string]: value }));
    };

    // Save les modifications du projet
    const handleSave = async () => {
        if (!id) return;

        try {
            await api.patch(`/api/projects/${id}/`, projectData);
            setIsEditing(false);
            // Recharge les données pour voir les changements
            await getProjectById(Number(id));
        } catch (error) {
            console.error("Failed to update project:", error);
        }
    };

    // Dialogue de confirmation
    const openConfirmDialog = () => {
        setConfirmOpen(true);
    };
    const closeConfirmDialog = () => {
        if (!isDeleting) {
            setConfirmOpen(false);
        }
    };

    // Gère la suppression après confirmation
    const handleConfirmDelete = async () => {
        if (!id) return;

        setIsDeleting(true);
        try {
            await api.delete(`/api/projects/${id}/`);
            closeConfirmDialog();
            navigate("/"); // Rediriger vers la page d'accueil après la suppression
        } catch (error) {
            console.error("Error delete project", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header pageTitle="Project" />
            <Divider />
            {selectedProject && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    {isEditing ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            width="100%"
                        >
                            <Typography variant="h5" component="h2">
                                Titre
                            </Typography>
                            <TextField
                                name="title"
                                value={projectData.title}
                                onChange={handleInputChange}
                                fullWidth
                            />

                            <Typography variant="h6" component="h3">
                                Description
                            </Typography>

                            <TextareaAutosize
                                name="description"
                                label="Description"
                                value={projectData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                fullWidth
                                style={{
                                    // pour avoir le même style que les TextField de MUI
                                    width: "100%",
                                    boxSizing: "border-box",
                                    borderRadius: 4,
                                    fontFamily:
                                        "Roboto, Helvetica, Arial, sans-serif",
                                    fontSize: "0.875rem",
                                }}
                            />
                            <Box display="flex" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                >
                                    Enregistrer
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <div width="100%">
                            <Typography
                                variant="h4"
                                component="h2"
                                fontWeight="bold"
                                fontSize={40}
                                display="flex"
                                justifyContent="center"
                                pb={2}
                            >
                                {selectedProject.title}
                            </Typography>
                            <Typography
                                variant="body1"
                                component="p"
                                fontSize={24}
                                display="flex"
                                justifyContent="center"
                                pb={4}
                            >
                                {selectedProject.description}
                            </Typography>
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    pb: 2,
                                    mb: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Modifier le projet
                                </Button>
                            </div>

                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleExportToCalendar}
                                >
                                    Exporter en .ics pour Google Calendar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <CreateTaskForm projectId={id} createTask={createTask} />
            <KanbanBoard
                projectId={id}
                tasks={tasks}
                onTaskMove={handleTaskMove}
            />
            <ProjectGrid />

            {/* Dialogue de confirmation pour supprimer un projet */}
            <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
                <DialogTitle>Supprimer le projet ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedProject
                            ? `Voulez-vous vraiment supprimer le projet "${selectedProject.title}" ? Cette action est irréversible et supprimera aussi toutes les tâches associées.`
                            : ""}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog} disabled={isDeleting}>
                        Annuler
                    </Button>
                    <Button
                        color="error"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        autoFocus
                    >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
}
