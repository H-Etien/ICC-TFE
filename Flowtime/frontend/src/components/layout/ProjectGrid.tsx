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

import ChartUserByCountry from "../charts/ChartUserByCountry";
import CustomizedTreeView from "../ui/CustomizedTreeView";
import CustomizedDataGrid from "../data/CustomizedDataGrid";
import HighlightedCard from "../ui/HighlightedCard";
import PageViewsBarChart from "../charts/PageViewsBarChart";
import SessionsChart from "../charts/SessionsChart";
import StatCard, { StatCardProps } from "../ui/StatCard";
import CircularProgress from "@mui/material/CircularProgress";
import Copyright from "../ui/Copyright";

import useProjects from "../../hooks/useProjects";

const data: StatCardProps[] = [
    // {
    //     title: "Users",
    //     value: "14k",
    //     interval: "Last 30 days",
    //     trend: "up",
    //     data: [
    //         200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360,
    //         340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460,
    //         600, 880, 920,
    //     ],
    // },
    // {
    //     title: "Conversions",
    //     value: "325",
    //     interval: "Last 30 days",
    //     trend: "down",
    //     data: [
    //         1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820,
    //         840, 600, 820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520,
    //         480, 400, 360, 300, 220,
    //     ],
    // },
    // {
    //     title: "Event count",
    //     value: "200k",
    //     interval: "Last 30 days",
    //     trend: "neutral",
    //     data: [
    //         500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530,
    //         620, 510, 530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420,
    //         510, 430, 520, 510,
    //     ],
    // },
];

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
            PROJECT GRID TO BE ADDED HERE
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
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
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <HighlightedCard />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SessionsChart />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <PageViewsBarChart />
                </Grid>
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Details
            </Typography>
            <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 12, lg: 9 }}>
                    <CustomizedDataGrid />
                </Grid>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Stack
                        gap={2}
                        direction={{ xs: "column", sm: "row", lg: "column" }}
                    >
                        <CustomizedTreeView />
                        <ChartUserByCountry />
                    </Stack>
                </Grid>
            </Grid>
            <Copyright sx={{ my: 4 }} />
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
