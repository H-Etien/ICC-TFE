import { Link } from "react-router-dom";
import { useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import StatCard, { StatCardProps } from "../ui/StatCard";
import CircularProgress from "@mui/material/CircularProgress";

import useProjects from "../../hooks/useProjects";

export default function ProjectGrid() {
    const { projects, loading, deleteProject } = useProjects();

    // Pour supprimer un projet avec confirmation
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmProject, setConfirmProject] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const openConfirm = (project: any, e?: React.SyntheticEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setConfirmProject(project);
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
        setConfirmProject(null);
    };

    const onConfirmDelete = async () => {
        if (!confirmProject) return;
        setDeletingId(confirmProject.id);
        try {
            await deleteProject(confirmProject.id);
            // Optionnel : feedback (toast/snackbar)
        } catch (err) {
            console.error("Delete failed", err);
            // Optionnel : afficher une erreur utilisateur
        } finally {
            setDeletingId(null);
            closeConfirm();
        }
    };
    // -----------------------

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 24,
                }}
            >
                <CircularProgress />
            </div>
        );
    }
    if (!projects || projects.length === 0) {
        return <div style={{ padding: 24 }}>Commencer à créer vos projets</div>;
    }

    // projects.map((project) => {
    //     console.log("Project in ProjectGrid:", project);
    // });

    return (
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Projets
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                {projects.map((project) => (
                    <Grid key={project.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CardActionArea
                                component={Link}
                                to={`/project/${project.id}`}
                                sx={{ flexGrow: 1, textAlign: "left" }}
                            >
                                <StatCard {...project} />

                                <IconButton
                                    aria-label={`Supprimer ${project.title}`}
                                    color="error"
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        zIndex: 5,
                                    }}
                                    onClick={(e) => openConfirm(project, e)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            openConfirm(project, e);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActionArea>
                        </Stack>
                    </Grid>
                ))}
            </Grid>

            {/* // Confirmation dialog pour supprimer le projet choisi */}
            <Dialog
                open={confirmOpen}
                onClose={closeConfirm}
                aria-labelledby="confirm-delete-title"
            >
                <DialogTitle id="confirm-delete-title">
                    Supprimer le projet ?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {confirmProject
                            ? `Voulez-vous vraiment supprimer le projet "${confirmProject.title}" ? `
                            : ""}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirm} disabled={!!deletingId}>
                        Annuler
                    </Button>
                    <Button
                        color="error"
                        onClick={onConfirmDelete}
                        disabled={!!deletingId}
                        autoFocus
                    >
                        {deletingId ? "Suppression..." : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
