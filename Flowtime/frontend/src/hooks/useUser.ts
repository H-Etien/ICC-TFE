import { useState, useCallback, useEffect } from "react";
import api from "../api";

interface User {
    id: number;
    username: string;
    email: string;
}

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getCurrentUser = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/api/user/me/");
            setUser(response.data);
            return response.data;
        } catch (err: any) {
            console.error("Failed to fetch current user:", err);
            setError(err.message || "Failed to fetch user data");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

    return {
        user,
        loading,
        error,
        getCurrentUser,
    };
}
