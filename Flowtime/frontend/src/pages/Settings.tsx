import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Divider,
    Stack,
    TextField,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PageLayout from "../components/layout/PageLayout";
import Header from "../components/layout/Header";
import useUser from "../hooks/useUser";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Settings(props: { disableCustomTheme?: boolean }) {
    const { user, getCurrentUser } = useUser();
    const navigate = useNavigate();

    // État des formulaires
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Mettre à jour l'état quand user change
    React.useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    // Sauvegarder les modifications
    const handleSaveChanges = async () => {
        if (!username.trim() || !email.trim()) {
            setMessage({ type: "error", text: "Tous les champs sont requis." });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage({ type: "error", text: "Email invalide." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await api.put("/api/user/me/", {
                username,
                email,
            });
            setMessage({
                type: "success",
                text: "Modifications sauvegardées avec succès!",
            });

            // Rafraîchir les données utilisateur
            setTimeout(() => {
                getCurrentUser();
            }, 500);
        } catch (error: any) {
            const errorMsg =
                error.response?.data?.username?.[0] ||
                error.response?.data?.email?.[0] ||
                "Erreur lors de la mise à jour.";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    // Supprimer le compte
    const handleDeleteAccount = async () => {
        setDeleteLoading(true);

        try {
            await api.delete("/api/user/me/");
            setMessage({
                type: "success",
                text: "Compte supprimé. Redirection...",
            });

            // Effacer les tokens et rediriger
            setTimeout(() => {
                localStorage.clear();
                navigate("/login");
            }, 1500);
        } catch (error: any) {
            setMessage({
                type: "error",
                text: "Erreur lors de la suppression du compte.",
            });
        } finally {
            setDeleteLoading(false);
            setOpenDeleteDialog(false);
        }
    };

    if (!user) {
        return (
            <PageLayout {...props}>
                <Header pageTitle="Settings" />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "60vh",
                    }}
                >
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout {...props}>
            <Header pageTitle="Paramètres" />
            <Divider sx={{ my: 2 }} />

            <Container maxWidth="sm">
                <Stack spacing={3}>
                    {/* Messages */}
                    {message && (
                        <Alert
                            severity={message.type}
                            onClose={() => setMessage(null)}
                        >
                            {message.text}
                        </Alert>
                    )}

                    {/*  Modifier le profil */}
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{ mb: 2, fontWeight: 600 }}
                            >
                                Modifier votre profil
                            </Typography>

                            <Stack spacing={2}>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Nom d'utilisateur
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Votre identifiant"
                                    variant="outlined"
                                    disabled={loading}
                                />

                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Adresse email
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    variant="outlined"
                                    disabled={loading}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveChanges}
                                    disabled={loading}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <SaveIcon />
                                        )
                                    }
                                    fullWidth
                                >
                                    {loading
                                        ? "Sauvegarde..."
                                        : "Sauvegarder les modifications"}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Divider />

                    {/* Supprimer le compte */}
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: 600,
                                    color: "error.main",
                                }}
                            >
                                Supprimer votre compte
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ mb: 2, color: "text.secondary" }}
                            >
                                Attention! La suppression de votre compte est
                                définitive et irréversible !!!
                            </Typography>

                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpenDeleteDialog(true)}
                                disabled={deleteLoading}
                                startIcon={<DeleteIcon />}
                                fullWidth
                            >
                                Supprimer mon compte
                            </Button>
                        </CardContent>
                    </Card>
                </Stack>
            </Container>

            {/* Dialog de confirmation */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle sx={{ color: "error.main", fontWeight: 600 }}>
                    Êtes-vous sûr?
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mt: 2 }}>
                        Cette action est définitive et irréversible. Vous
                        perdrez accès à tous vos projets et tâches.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        disabled={deleteLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="contained"
                        disabled={deleteLoading}
                        startIcon={
                            deleteLoading ? (
                                <CircularProgress size={20} />
                            ) : undefined
                        }
                    >
                        {deleteLoading
                            ? "Suppression..."
                            : "Supprimer définitivement"}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
}
