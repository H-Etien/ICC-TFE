import { useState, useEffect } from "react";

import Header from "../components/layout/Header";
import HomeGrid from "../components/layout/HomeGrid";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "../styles/customizations";

import ProjectForm from "../components/forms/ProjectForm";
import PageLayout from "../components/layout/PageLayout";
import api from "../api";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function Home(props: { disableCustomTheme?: boolean }) {
    const [projects, setProjects] = useState([]);
    const [titles, setTitles] = useState([]);

    // Pour récupérer les projets
    const getProjects = async () => {
        try {
            const response = await api.get("/api/projects/").then((res) => {
                setProjects(res.data);
                const projectTitles = res.data.map(
                    (project: { title: string }) => project.title
                );
                setTitles(projectTitles);
            });
        } catch (error) {
            console.error("Error getting projects:", error);
        }
    };

    const deleteProject = async (projectId: number) => {
        try {
            await api.delete(`/api/projects/${projectId}/`);
            // Mettre à jour la liste des projets après la suppression
            getProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };
    const createProject = async (newProject: {
        title: string;
        description: string;
    }) => {
        try {
            newProject.preventDefault();

            await api.post("/api/projects/", newProject);
            // Mettre à jour la liste des projets après la création
            getProjects();
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    useEffect(() => {
        getProjects();
        console.log("Projects titles:", titles);
    }, []);

    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header />
            <HomeGrid />
            <ProjectForm />
        </PageLayout>
    );
}
