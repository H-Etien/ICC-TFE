import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { useState, useEffect } from "react";

import useProjects from "../../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { create } from "node_modules/@mui/material/esm/styles/createTransitions";

export default function CreateProjectForm({}) {
    const [open, setOpen] = useState(false);
    const { createProject } = useProjects();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const createdProject = await createProject({
                title: event.currentTarget.title.value,
                description: event.currentTarget.description.value,
            });
            setOpen(false);
            if (createdProject && createdProject.id) {
                navigate(`/project/${createdProject.id}`);
                console.log("Project created with ID:", createdProject.id);
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
                Créer un projet
            </Button>{" "}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: { width: isMobileScreen ? "100%" : "50%" }, // prendre la moitié de l'écran ou plein écran si petit écran
                }}
            >
                <div style={{ padding: 24 }}>
                    <h2>Contenu du Drawer</h2>
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
                            <FormLabel htmlFor="title">Titre</FormLabel>
                            <TextField
                                autoComplete="title"
                                name="title"
                                required
                                fullWidth
                                id="title"
                                placeholder="Mon projet incroyable"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? "error" : "primary"}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="description">
                                Description
                            </FormLabel>
                            <TextField
                                name="description"
                                placeholder="Description du projet"
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
