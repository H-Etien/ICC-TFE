import { useCallback, useState } from "react";
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

    const createTask = async ({
        projectId,
        payload,
    }: {
        projectId: number;
        payload: { title: string; content: string; assigned_to?: number };
    }) => {
        try {
            const response = await api.post(
                `api/projects/${projectId}/tasks/`,
                payload
            );
            const createdTask = response.data;

            // Avoir la nouvelle liste de Task sans recharger la page
            setTasks((prevTasks) => [createdTask, ...prevTasks]);
            return createdTask;
        } catch (error) {
            console.error("Failed to create task:", error);
            throw error;
        }
    };

    return { tasks, setTasks, getTasks, createTask };
}
