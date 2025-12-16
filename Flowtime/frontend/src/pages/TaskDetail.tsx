import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import { FormLabel, TextareaAutosize } from "@mui/material";

import useTasks from "../hooks/useTasks";

import PageLayout from "../components/layout/PageLayout";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import api from "../api";

export default function TaskDetail(props: { disableCustomTheme?: boolean }) {
    const { projectId, taskId } = useParams<{
        projectId: string;
        taskId: string;
    }>();
    const { getTaskById, selectedTask, loading, deleteTask } = useTasks();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [taskData, setTaskData] = useState({
        title: "",
        content: "",
    });

    // Pour le dialogue de confirmation de suppression de la Task
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (projectId && taskId) {
            getTaskById(Number(projectId), Number(taskId));
        }
    }, [projectId, taskId, getTaskById]);

    useEffect(() => {
        if (selectedTask) {
            setTaskData({
                title: selectedTask.title,
                content: selectedTask.content,
                status: selectedTask.status,
            });
            setStartDate(
                selectedTask.start_time ? dayjs(selectedTask.start_time) : null
            );
            setEndDate(
                selectedTask.end_time ? dayjs(selectedTask.end_time) : null
            );
        }
    }, [selectedTask]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | { name?: string; value: unknown }
        >
    ) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name as string]: value }));
    };

    const handleSave = async () => {
        if (!projectId || !taskId) return;

        const payload = {
            ...taskData,
            start_time: startDate ? startDate.toISOString() : null,
            end_time: endDate ? endDate.toISOString() : null,
        };

        try {
            await api.patch(
                `/api/projects/${projectId}/tasks/${taskId}/`,
                payload
            );
            setIsEditing(false);
            // Recharger les données pour voir les changements
            getTaskById(Number(projectId), Number(taskId));
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    // Ouvre le dialogue de confirmation
    const openConfirmDialog = () => {
        setConfirmOpen(true);
    };

    // Ferme le dialogue de confirmation
    const closeConfirmDialog = () => {
        if (!isDeleting) {
            setConfirmOpen(false);
        }
    };

    // Gère la suppression après confirmation
    const handleConfirmDelete = async () => {
        if (!projectId || !taskId) return;

        setIsDeleting(true);
        try {
            await deleteTask(Number(projectId), Number(taskId));
            closeConfirmDialog();
            navigate(`/project/${projectId}`); // Rediriger après la suppression
        } catch (error) {
            console.error("Failed to delete task:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <PageLayout {...props}>
                <CircularProgress />
            </PageLayout>
        );
    }

    if (!selectedTask) {
        return (
            <PageLayout {...props}>
                <Typography>Tâche non trouvée.</Typography>
            </PageLayout>
        );
    }

    return (
        <PageLayout {...props}>
            <Card sx={{ width: "100%", maxWidth: 800, mt: 2 }}>
                <CardContent>
                    {isEditing ? (
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Typography variant="p">Titre</Typography>
                            <TextField
                                name="title"
                                value={taskData.title}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            {/* <TextField
                                label="Description"
                                name="content"
                                value={taskData.content}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                fullWidth
                            /> */}

                            <FormControl>
                                <Typography variant="p">Description</Typography>

                                <TextareaAutosize
                                    name="content"
                                    id="content"
                                    value={taskData.content}
                                    onChange={handleInputChange}
                                    required
                                    minRows={4}
                                    maxRows={8}
                                    placeholder="Description de la tâche"
                                    style={{
                                        // pour avoir le même style que les TextField de MUI
                                        width: "100%",
                                        boxSizing: "border-box",
                                        borderRadius: 4,
                                        fontFamily:
                                            "Roboto, Helvetica, Arial, sans-serif",
                                        fontSize: "0.875rem",
                                    }}
                                    aria-label="Description de la tâche"
                                />
                            </FormControl>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Date de début"
                                    value={startDate}
                                    onChange={setStartDate}
                                    maxDate={endDate}
                                    ampm={false}
                                />
                                <DateTimePicker
                                    label="Date de fin"
                                    value={endDate}
                                    onChange={setEndDate}
                                    minDate={startDate}
                                    ampm={false}
                                />
                            </LocalizationProvider>

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
                        <Box>
                            <Typography variant="h4">
                                {selectedTask.title}
                            </Typography>
                            <Typography variant="body1">
                                {selectedTask.content || "Pas de description."}
                            </Typography>

                            {/* Afficher les dates */}
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Date de début:</strong>{" "}
                                    {startDate
                                        ? startDate.format("DD/MM/YYYY HH:mm")
                                        : "Non définie"}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    <strong>Date de fin:</strong>{" "}
                                    {endDate
                                        ? endDate.format("DD/MM/YYYY HH:mm")
                                        : "Non définie"}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                onClick={() => setIsEditing(true)}
                                sx={{ mt: 2 }}
                            >
                                Modifier
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={openConfirmDialog}
                                sx={{ mt: 2, ml: 1 }}
                            >
                                Supprimer
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
            <Button
                onClick={() => navigate(`/project/${projectId}`)}
                sx={{ mt: 2 }}
            >
                Retour au projet
            </Button>

            {/* Dialogue de confirmation pour supprimer une Task */}
            <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
                <DialogTitle>Supprimer la tâche ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedTask
                            ? `Voulez-vous vraiment supprimer la tâche "${selectedTask.title}" ? Cette action est irréversible.`
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
