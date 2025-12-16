import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const { getProjectById, selectedProject } = useProjects();
    const { getTasks, tasks, setTasks, createTask } = useTasks();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [projectData, setProjectData] = useState({
        title: "",
        description: "",
    });

    // Pour la gestion des membres
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);

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

    // Ajouter un membre au projet
    const handleAddMember = async () => {
        if (!newMemberEmail.trim() || !id) return;

        setIsAddingMember(true);
        try {
            await api.post(`/api/projects/${id}/add_member/`, {
                email: newMemberEmail,
            });
            setNewMemberEmail("");
            // Recharge le projet pour voir les nouveaux membres
            await getProjectById(Number(id));
        } catch (error) {
            console.error("Error adding member:", error);
        } finally {
            setIsAddingMember(false);
        }
    };

    // Supprimer un membre du projet
    const handleRemoveMember = async (memberId: number) => {
        if (!id) return;

        setIsRemovingMember(true);
        try {
            await api.post(`/api/projects/${id}/remove_member/`, {
                member_id: memberId,
            });
            // Recharge le projet
            await getProjectById(Number(id));
        } catch (error) {
            console.error("Error removing member:", error);
        } finally {
            setIsRemovingMember(false);
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
                                {t("project.title_label")}
                            </Typography>
                            <TextField
                                name="title"
                                value={projectData.title}
                                onChange={handleInputChange}
                                fullWidth
                            />

                            <Typography variant="h6" component="h3">
                                {t("project.description_label")}
                            </Typography>

                            <TextareaAutosize
                                name="description"
                                aria-label="Description"
                                value={projectData.description}
                                onChange={handleInputChange}
                                minRows={2}
                                maxRows={4}
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

                            {/* Gestion des membres */}
                            <Typography variant="h6" component="h3">
                                {t("project.members")}
                            </Typography>

                            {selectedProject?.members && (
                                <Box sx={{ mb: 2 }}>
                                    {selectedProject.members.map(
                                        (member: any) => (
                                            <Box
                                                key={member.id}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{
                                                    p: 1,
                                                    mb: 1,
                                                    border: "1px solid #eee",
                                                    borderRadius: 1,
                                                }}
                                            >
                                                <Typography>
                                                    {member.email}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member.id
                                                        )
                                                    }
                                                    disabled={
                                                        isRemovingMember ||
                                                        member.id ===
                                                            selectedProject
                                                                .owner.id
                                                    }
                                                >
                                                    {t("project.remove_member")}
                                                </Button>
                                            </Box>
                                        )
                                    )}
                                </Box>
                            )}

                            {/* Ajouter un nouveau membre */}
                            <Box display="flex" gap={1}>
                                <TextField
                                    label={t("project.member_email")}
                                    value={newMemberEmail}
                                    onChange={(e) =>
                                        setNewMemberEmail(e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddMember}
                                    disabled={
                                        !newMemberEmail.trim() || isAddingMember
                                    }
                                >
                                    {isAddingMember
                                        ? t("project.saving")
                                        : t("project.add_member")}
                                </Button>
                            </Box>

                            <Box display="flex" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                >
                                    {t("common.save")}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <div>
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
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditing(true)}
                                >
                                    {t("project.edit_project")}
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
                                    {t("project.export_calendar")}
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
                <DialogTitle>{t("project.confirm_delete_project")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedProject
                            ? `${t("project.confirm_delete_project")} "${selectedProject.title}"`
                            : ""}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog} disabled={isDeleting}>
                        {t("common.cancel")}
                    </Button>
                    <Button
                        color="error"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        autoFocus
                    >
                        {isDeleting
                            ? t("project.deleting")
                            : t("project.delete_confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
}
