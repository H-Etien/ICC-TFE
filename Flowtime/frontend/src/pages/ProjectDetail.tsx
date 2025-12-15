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

    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header pageTitle="Project" />
            <Divider />
            {selectedProject && (
                <div>
                    <h2>{selectedProject.title}</h2>
                    <p>{selectedProject.description}</p>
                </div>
            )}

            <CreateTaskForm projectId={id} createTask={createTask} />
            <KanbanBoard
                projectId={id}
                tasks={tasks}
                onTaskMove={handleTaskMove}
            />
            <ProjectGrid />
        </PageLayout>
    );
}
