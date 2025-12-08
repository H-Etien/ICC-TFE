import { useCallback, useEffect, useState } from "react";
import api from "../api";

export default function useTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getTasks = useCallback(async (projectId: number) => {
        setLoading(true);

        try {
            const response = await api.get(`/api/projects/${projectId}/tasks/`);
            setTasks(response.data);
            return response.data;
        } catch (error: any) {
            console.error("getTasks error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = useCallback(
        async ({
            projectId,
            payload,
        }: {
            projectId: number;
            payload: { title: string; content: string };
        }) => {
            setLoading(true);
            try {
                const response = await api.post(
                    `/api/projects/${projectId}/tasks/`,
                    payload
                );
                await getTasks(projectId);
                return response.data;
            } catch (error: any) {
                console.error("createTask error:", error);
            } finally {
                setLoading(false);
            }
        },
        [getTasks]
    );

    return {
        getTasks,
        createTask,
    };
}
