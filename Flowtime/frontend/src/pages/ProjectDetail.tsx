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

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function ProjectDetail(props: { disableCustomTheme?: boolean }) {
    const { id } = useParams<{ id: string }>();
    const { getProjectById, selectedProject } = useProjects();
    const { getTasks, tasks } = useTasks();

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

    // console.log("Selected Project:", selectedProject);

    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header pageTitle="Project" />
            <Divider />
            <CreateTaskForm projectId={id} />
            {selectedProject && (
                <div>
                    <h2>{selectedProject.title}</h2>
                    <p>{selectedProject.description}</p>
                    <p>{selectedProject.id}</p>
                </div>
            )}
            <div>oqsidfjoqsidjf</div>
            <KanbanBoard tasks={tasks}></KanbanBoard>
            <ProjectGrid />
        </PageLayout>
    );
}
