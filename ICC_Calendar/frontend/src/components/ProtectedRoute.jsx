import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

// Assure la protection des routes, il faut l'authentification avant de voir la page protégé
function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // Vérifie si l'utilisateur est autorisé à accéder à la route protégée
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);

                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Erreur du token:", error);
            setIsAuthorized(false);
        }
    };

    // Refresh le token d'accès
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokdenExpiraion = decoded.exp;
        const now = Date.now() / 1000;

        if (tokdenExpiraion < now) {
            // Token expiré, essaye de refresh
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
