import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
    CircularProgress,
    Chip,
    Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";

import api from "../api";
import PageLayout from "../components/layout/PageLayout";
import Header from "../components/layout/Header";

export default function Premium(props: { disableCustomTheme?: boolean }) {
    const [loading, setLoading] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        checkPremiumStatus();
    }, []);

    const checkPremiumStatus = async () => {
        try {
            const response = await api.get("/api/stripe/premium-status/");
            setIsPremium(response.data.is_premium);
            setExpiresAt(response.data.expires_at);
        } catch (error) {
            console.error("Error checking premium status:", error);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleUpgradeToPremium = async () => {
        setLoading(true);
        try {
            const response = await api.post(
                "/api/stripe/create-checkout-session/"
            );

            // Rediriger vers Stripe Checkout
            window.location.href = response.data.checkout_url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
            setLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <PageLayout {...props}>
                <Header pageTitle="Premium" />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "50vh",
                    }}
                >
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout {...props}>
            <Header pageTitle="Premium" />
            <Divider sx={{ my: 2 }} />

            <Box
                sx={{
                    maxWidth: 600,
                    width: "100%",
                    margin: "0 auto",
                    mt: 4,
                }}
            >
                {isPremium ? (
                    <Card elevation={3}>
                        <CardContent>
                            <Stack spacing={3} alignItems="center">
                                <CheckCircleIcon
                                    sx={{ fontSize: 80, color: "success.main" }}
                                />
                                <Typography variant="h5" fontWeight="bold">
                                    Vous êtes Premium!
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    Profitez de toutes les fonctionnalités
                                    illimitées de Flowtime.
                                </Typography>
                                {expiresAt && (
                                    <Chip
                                        label={`Expire le ${new Date(
                                            expiresAt
                                        ).toLocaleDateString("fr-FR")}`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}

                                <Divider sx={{ width: "100%", my: 2 }} />

                                <Stack spacing={1} sx={{ width: "100%" }}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                    >
                                        Avantages Premium actifs :
                                    </Typography>
                                    <Typography variant="body2">
                                        ✅ Accès illimité à l'IA de génération
                                        de projets
                                    </Typography>

                                    <Typography variant="body2">
                                        ✅ Projets illimités
                                    </Typography>
                                    <Typography variant="body2">
                                        ✅ Export avancé des données
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ) : (
                    <Card elevation={3}>
                        <CardContent>
                            <Stack spacing={3}>
                                <Box textAlign="center">
                                    <StarIcon
                                        sx={{
                                            fontSize: 60,
                                            color: "warning.main",
                                        }}
                                    />
                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        sx={{ mt: 2 }}
                                    >
                                        Passez à Premium
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="primary"
                                        sx={{ mt: 1 }}
                                    >
                                        9.99€ / an
                                    </Typography>
                                </Box>

                                <Divider />

                                <Stack spacing={2}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                    >
                                        Fonctionnalités Premium :
                                    </Typography>
                                    <Typography variant="body1">
                                        ✅ Accès illimité à l'IA de génération
                                        de projets
                                    </Typography>
                                    <Typography variant="body1">
                                        ✅ Support prioritaire
                                    </Typography>
                                    <Typography variant="body1">
                                        ✅ Projets illimités
                                    </Typography>
                                    <Typography variant="body1">
                                        ✅ Export avancé des données
                                    </Typography>
                                </Stack>

                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={handleUpgradeToPremium}
                                    disabled={loading}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <StarIcon />
                                        )
                                    }
                                >
                                    {loading
                                        ? "Redirection..."
                                        : "Passer à Premium"}
                                </Button>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    Paiement sécurisé par Stripe
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </PageLayout>
    );
}
