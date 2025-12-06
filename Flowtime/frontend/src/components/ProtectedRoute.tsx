import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { JSX } from "react";

import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

type Props = {
    children: JSX.Element;
};

// Pour protéger les routes nécessitant une authentification
function ProtectedRoute({ children }: Props): JSX.Element | null {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        authenticate().catch(() => setIsAuthorized(false)); // si problème, pas autorisé à se connecter sur le lien
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });

            // Pour mettre à jour le token d'accès dans le localStorage
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Token refresh Error :", error);
            setIsAuthorized(false);
        }
    };

    const authenticate = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        // Pour vérifier si le token a expiré
        const decoded = jwtDecode<{ exp: number }>(token);
        const TokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        // Rafraichir le token s'il a expiré
        if (TokenExpiration < now) {
            await refreshToken();
        } else {
            // Token pas encore expiré
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return null;
    }
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
