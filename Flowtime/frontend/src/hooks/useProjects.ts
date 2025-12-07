import { useCallback, useEffect, useState } from "react";
import api from "../api";

export default function useProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getProjects = useCallback(async () => {
        setLoading(true);

        try {
            const res = await api.get("/api/projects/");
            setProjects(res.data);
        } catch (error: any) {
            console.error("getProjects error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // create helper
    const createProject = useCallback(
        async (payload: { title: string; description: string }) => {
            setLoading(true);

            try {
                await api.post("/api/projects/", payload);
                await getProjects(); // Redonne la liste après création
            } catch (error: any) {
                console.error("createProject error:", error);
            } finally {
                setLoading(false);
            }
        },
        [getProjects]
    );

    // delete helper
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
    }, [getProjects]);

    return {
        projects,
        loading,
        getProjects,
        createProject,
        deleteProject,
        setProjects,
    };
}
