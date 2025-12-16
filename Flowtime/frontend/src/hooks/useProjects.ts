import { useCallback, useEffect, useState } from "react";
import api from "../api";

export default function useProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Pour stocker le projet sélectionné
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const getProjects = useCallback(async () => {
        setLoading(true);

        try {
            const response = await api.get("/api/projects/");

            // Eviter les doublons
            const uniqueProjects = response.data.filter(
                (project, index, self) =>
                    index ===
                    self.findIndex((position) => position.id === project.id)
            );
            setProjects(uniqueProjects);
            return uniqueProjects;
        } catch (error: any) {
            console.error("getProjects error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getProjectById = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/projects/${id}/`);
            setSelectedProject(response.data);
            return response.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = useCallback(
        async (payload: { title: string; description: string }) => {
            setLoading(true);

            try {
                const response = await api.post("/api/projects/", payload);
                await getProjects(); // Redonne la liste après création
                return response.data;
            } catch (error: any) {
                console.error("createProject error:", error);
            } finally {
                setLoading(false);
            }
        },
        [getProjects]
    );

    const deleteProject = useCallback(
        async (id: number) => {
            setLoading(true);

            try {
                await api.delete(`/api/projects/${id}/`);
                await getProjects();
            } catch (error: any) {
                console.error("deleteProject error:", error);
            } finally {
                setLoading(false);
            }
        },
        [getProjects]
    );

    useEffect(() => {
        getProjects();
    }, []);

    return {
        projects,
        loading,
        getProjects,
        createProject,
        deleteProject,
        getProjectById,
        selectedProject,
    };
}
