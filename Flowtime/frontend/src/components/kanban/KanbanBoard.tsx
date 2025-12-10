import React from "react";
import { useState } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

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
    onTaskMove?: (taskId: number | string, newStatus: TaskStatus) => void;
}

// Composant pour une tâche déplaçable
interface DraggableTaskProps {
    task: Task;
}

function DraggableTask({ task }: DraggableTaskProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
    };

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <CardContent>
                <Typography variant="subtitle1">{task.title}</Typography>
                {task.content && (
                    <Typography variant="body2" color="text.secondary">
                        {task.content}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

// Composant pour une colonne droppable
interface DroppableColumnProps {
    status: TaskStatus;
    children: React.ReactNode;
}

function DroppableColumn({ status, children }: DroppableColumnProps) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <Box
            ref={setNodeRef}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight: 400, // Zone de drop même si vide
            }}
        >
            {children}
        </Box>
    );
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove }) => {
    // Prendre la Task à drag & drop
    const [activeId, setActiveId] = useState<number | string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Commencer le drag après 8 pixels de déplacement
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // over.id est soit l'ID d'une tâche, soit l'ID d'une colonne (status)
        const overId = over.id as string;

        // Si on relâche sur une colonne (status)
        if (allStatuses.includes(overId as TaskStatus)) {
            const newStatus = overId as TaskStatus;
            const taskId = active.id;

            // Appeler le callback parent pour mettre à jour le statut
            if (onTaskMove) {
                onTaskMove(taskId, newStatus);
            }
        } else {
            // Si on relâche sur une autre tâche, déduire la colonne de cette tâche
            const targetTask = tasks.find((t) => t.id === overId);
            if (targetTask && onTaskMove) {
                onTaskMove(active.id, targetTask.status);
            }
        }
    };

    const activeTask = tasks.find((task) => task.id === activeId);

    // 3 type de colonnes
    const allStatuses: TaskStatus[] = ["todo", "doing", "done"];

    // Regrouper les tâches par statut et les trier
    const columns: Record<TaskStatus, Task[]> = {
        todo: tasks
            .filter((task) => task.status === "todo")
            .sort((a, b) => a.order - b.order),
        doing: tasks
            .filter((task) => task.status === "doing")
            .sort((a, b) => a.order - b.order),
        done: tasks
            .filter((task) => task.status === "done")
            .sort((a, b) => a.order - b.order),
    };

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
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Box sx={{ padding: 6, width: "100%" }}>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",

                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                    }}
                >
                    {allStatuses.map((status) => (
                        <Grid key={status} size="grow">
                            {/* Colonne avec Status */}
                            <Paper
                                // id permet le drop sur la colonne entière
                                id={status}
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
                                <DroppableColumn status={status}>
                                    {columns[status].map((task) => (
                                        <DraggableTask
                                            key={task.id}
                                            task={task}
                                        />
                                    ))}
                                </DroppableColumn>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Overlay pour montrer la tâche pendant le drag */}
            <DragOverlay>
                {activeTask ? (
                    <Card sx={{ opacity: 0.9 }}>
                        <CardContent>
                            <Typography variant="subtitle1">
                                {activeTask.title}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;
