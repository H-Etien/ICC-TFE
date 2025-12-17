import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                                    {t("premium.you_are_premium")}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    {t("premium.enjoy_features")}
                                </Typography>
                                {expiresAt && (
                                    <Chip
                                        label={`${t(
                                            "premium.expires_on"
                                        )} ${new Date(
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
                                        {t("premium.active_benefits")}
                                    </Typography>
                                    <Typography variant="body2">
                                        {t("premium.unlimited_ai")}
                                    </Typography>

                                    <Typography variant="body2">
                                        {t("premium.unlimited_projects")}
                                    </Typography>
                                    <Typography variant="body2">
                                        {t("premium.advanced_export")}
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
                                        {t("premium.upgrade_to_premium")}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="primary"
                                        sx={{ mt: 1 }}
                                    >
                                        {t("premium.price")}
                                    </Typography>
                                </Box>

                                <Divider />

                                <Stack spacing={2}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                    >
                                        {t("premium.features")}
                                    </Typography>
                                    <Typography variant="body1">
                                        {t("premium.unlimited_ai")}
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
                                        ? t("premium.redirecting")
                                        : t("premium.upgrade_to_premium")}
                                </Button>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    {t("premium.secure_payment")}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </PageLayout>
    );
}
