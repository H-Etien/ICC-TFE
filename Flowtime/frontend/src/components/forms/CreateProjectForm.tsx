import * as React from "react";
import {
    Box,
    Button,
    Drawer,
    FormControl,
    FormLabel,
    TextField,
    Stack,
    useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { useTheme } from "@mui/material/styles";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import useProjects from "../../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { create } from "node_modules/@mui/material/esm/styles/createTransitions";

export default function CreateProjectForm({}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { createProject } = useProjects();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const title = String(data.get("title") || "");
        const description = String(data.get("description") || "");

        try {
            const createdProject = await createProject({
                title: title, // valueOf() pour avoir un string et pas un string object
                description: description,
            });
            setOpen(false);
            if (createdProject && createdProject.id) {
                navigate(`/project/${createdProject.id}`);
            } else {
                // Si erreur avec l'ID, redirige vers la page générale des projets
                navigate(`/project`);
                console.log("Error : Created project ID not found.");
            }
        } catch (error) {
            console.error("Error creating project:", error);
            return;
        }
    };

    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    // pour rendre le drawer responsive, si écran mobile, on le met en full screen
    const theme = useTheme();
    const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (open === true) {
            setNameError(false);
            setNameErrorMessage("");
        }
    }, [open]);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                {t("project.create_project")}
            </Button>{" "}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                    paper: {
                        sx: { width: isMobileScreen ? "100%" : "50%" }, // prendre la moitié de l'écran ou plein écran si petit écran
                    },
                }}
            >
                <div style={{ padding: 24 }}>
                    <h2>{t("project.create_project")}</h2>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="title">
                                {t("project.project_title")}
                            </FormLabel>
                            <TextField
                                autoComplete="title"
                                name="title"
                                required
                                fullWidth
                                id="title"
                                placeholder={t("project.project_title")}
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? "error" : "primary"}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="description">
                                {t("project.project_description")}
                            </FormLabel>
                            <TextField
                                name="description"
                                placeholder={t("project.project_description")}
                                type="text"
                                id="description"
                                autoComplete="description"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                onClick={() => setOpen(false)}
                                title={t("common.cancel")}
                                sx={{
                                    minWidth: 0,
                                    width: 40,
                                    height: 40,
                                    padding: 0,
                                    borderRadius: "20%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CloseIcon />
                            </Button>
                            <Button
                                type="submit"
                                variant="outlined"
                                title={t("common.save")}
                                sx={{
                                    minWidth: 0,
                                    width: 40,
                                    height: 40,
                                    padding: 0,
                                    borderRadius: "20%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <DoneIcon />
                            </Button>
                        </Stack>
                    </Box>
                </div>
                {/* contenu : form, boutons, header */}
            </Drawer>
        </>
    );
}
