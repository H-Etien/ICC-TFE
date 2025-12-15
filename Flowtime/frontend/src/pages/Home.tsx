import { useState, useEffect } from "react";

import Header from "../components/layout/Header";
import HomeGrid from "../components/layout/HomeGrid";
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from "../styles/customizations";

import Divider from "@mui/material/Divider";

import CreateProjectForm from "../components/forms/CreateProjectForm";
import PageLayout from "../components/layout/PageLayout";
import useProjects from "../hooks/useProjects";

import { useTranslation } from "react-i18next";

import api from "../api";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function Home(props: { disableCustomTheme?: boolean }) {
    const { t } = useTranslation();
    const { projects, loading, getProjects, createProject, deleteProject } =
        useProjects();

    useEffect(() => {
        console.log(
            "Project titles:",
            projects.map((p) => p.title)
        );
    }, [projects]);

    return (
        <PageLayout {...props} themeComponents={xThemeComponents}>
            <Header pageTitle={t("home.title")} />
            <Divider />
            <CreateProjectForm />
            <HomeGrid />
        </PageLayout>
    );
}
