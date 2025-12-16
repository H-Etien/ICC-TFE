import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Link, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const GDPR_CONSENT_KEY = "gdpr_consent";

export default function GDPRBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifier si l'utilisateur a déjà donné son consentement
        const consent = localStorage.getItem(GDPR_CONSENT_KEY);
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(GDPR_CONSENT_KEY, "accepted");
        setShowBanner(false);
    };

    const handleReject = () => {
        localStorage.setItem(GDPR_CONSENT_KEY, "rejected");
        setShowBanner(false);
    };

    const handleViewPolicy = () => {
        navigate("/about");
        setShowBanner(false);
    };

    return (
        <Snackbar
            open={showBanner}
            autoHideDuration={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            sx={{
                "& .MuiSnackbarContent-root": {
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    backgroundColor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 600,
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, mb: 1 }}
                    >
                        🍪 Consentement aux cookies et données personnelles
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.6 }}
                    >
                        Nous respectons votre vie privée. Nous utilisons des
                        cookies et traitons vos données conformément au RGPD.{" "}
                        <Link
                            onClick={handleViewPolicy}
                            sx={{
                                cursor: "pointer",
                                color: "primary.main",
                                textDecoration: "underline",
                            }}
                        >
                            En savoir plus
                        </Link>
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        minWidth: 300,
                    }}
                >
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleReject}
                        sx={{ textTransform: "none" }}
                    >
                        Refuser
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleAccept}
                        sx={{ textTransform: "none" }}
                    >
                        Accepter
                    </Button>
                </Box>

                <Box
                    component="button"
                    onClick={() => setShowBanner(false)}
                    sx={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                        "&:hover": { color: "text.primary" },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </Box>
            </Box>
        </Snackbar>
    );
}
