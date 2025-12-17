import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PageLayout from "../components/layout/PageLayout";
import Header from "../components/layout/Header";

import api from "../api";

export default function PremiumSuccess(props: {
    disableCustomTheme?: boolean;
}) {
    const navigate = useNavigate();

    useEffect(() => {
        // Rediriger automatiquement après 3 secondes
        const timeout = setTimeout(() => {
            navigate("/premium");
        }, 3000);

        return () => clearTimeout(timeout);
    }, [navigate]);

    // Activer le premium côté backend
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const session_id = sessionStorage.getItem("session_id");

                // Appeler l'endpoint pour activer le premium
                console.log("Passage en premium et facturation");
                const response = await api.post(
                    "/api/stripe/activate-premium/",
                    {
                        session_id: session_id,
                    }
                );
                console.log("Premium activé:", response.data);
            } catch (error) {
                console.error("Erreur:", error);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <PageLayout {...props}>
            <Header pageTitle="Paiement réussi" />

            <Box
                sx={{
                    maxWidth: 600,
                    width: "100%",
                    margin: "0 auto",
                    mt: 4,
                }}
            >
                <Card elevation={3}>
                    <CardContent>
                        <Stack spacing={3} alignItems="center">
                            <CheckCircleIcon
                                sx={{ fontSize: 100, color: "success.main" }}
                            />
                            <Typography variant="h4" fontWeight="bold">
                                Paiement réussi ! 🎉
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Votre compte Premium a été activé avec succès.
                                Vous pouvez maintenant profiter de toutes les
                                fonctionnalités premium de Flowtime !
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate("/premium")}
                            >
                                Voir mon statut Premium
                            </Button>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Redirection automatique dans 3 secondes...
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </PageLayout>
    );
}
