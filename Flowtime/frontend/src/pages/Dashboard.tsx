import { useState, useEffect } from "react";

import Header from "../components/layout/Header";
import MainGrid from "../components/layout/MainGrid";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "../styles/customizations";

import PageLayout from "../components/layout/PageLayout";
import api from "../api";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
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
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        getProjects();
        console.log("Projects titles:", titles);
    }, []);

    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header />
            <MainGrid />
        </PageLayout>
    );
}
