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
    const { getTasks } = useTasks();

    useEffect(() => {
        (async () => {
            if (!id) return;

            try {
                // Pour avoir les détails de la Task
                await getTasks(Number(id));
            } catch (e) {
                console.error(e);
            } finally {
            }
        })();
    }, [id, getTasks]);

    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header pageTitle="Project" />
            {selectedProject && (
                <div>
                    <h2>{selectedProject.title}</h2>
                    <p>{selectedProject.description}</p>
                    <p>{selectedProject.id}</p>
                </div>
            )}
            <div>oqsidfjoqsidjf</div>
            <ProjectGrid />"
        </PageLayout>
    );
}
