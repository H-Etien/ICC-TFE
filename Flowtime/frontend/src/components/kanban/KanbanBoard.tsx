// frontend/src/components/kanban/KanbanBoard.tsx
import React from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";

// Définir les types pour les tâches et les colonnes
export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
    id: number | string;
    title: string;
    content?: string;
    status: TaskStatus;
    order: number;
}

interface KanbanBoardProps {
    tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
    // Regrouper les tâches par statut
    const columns = tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
            acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    // S'assurer que toutes les colonnes sont présentes, même si elles sont vides
    const allStatuses: TaskStatus[] = ["todo", "doing", "done"];
    allStatuses.forEach((status) => {
        if (!columns[status]) {
            columns[status] = [];
        }
        // Trier les tâches par ordre
        columns[status].sort((a, b) => a.order - b.order);
    });

    const getColumnTitle = (status: TaskStatus) => {
        switch (status) {
            case "todo":
                return "À faire";
            case "doing":
                return "En cours";
            case "done":
                return "Terminé";
        }
    };

    return (
        <Box sx={{ padding: 6, width: "100%" }}>
            <Grid
                container
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    // alignItems: "center", // Enlevé pour permettre l'étirement (stretch) en largeur sur mobile
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                {allStatuses.map((status) => (
                    <Grid item xs={12} md={4} key={status} size="grow">
                        {/* Colonne avec Status */}
                        <Paper
                            sx={{
                                minHeight: 500,
                                padding: 1,
                                backgroundColor: "#9cabc2ff",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    textTransform: "uppercase",
                                    fontSize: "0.875rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {getColumnTitle(status)}
                            </Typography>

                            {/* Liste de Task  */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {columns[status].map((task) => (
                                    <Card key={task.id}>
                                        <CardContent>
                                            <Typography variant="subtitle1">
                                                {task.title}
                                            </Typography>
                                            {task.content && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {task.content}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default KanbanBoard;
