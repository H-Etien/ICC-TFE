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

import { useNavigate } from "react-router-dom";
import useTasks from "../../hooks/useTasks";

export default function CreateTaskForm({}) {
    const [open, setOpen] = useState(false);
    const { createTask } = useTasks();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const title = String(data.get("title") || "");
        const content = String(data.get("description") || "");

        try {
            const createdTask = await createTask({
                projectId: Number(event.currentTarget.projectId.value),
                payload: {
                    title: title, // valueOf() pour avoir un string et pas un string object
                    content: content,
                },
            });
            setOpen(false);
            if (createdTask && createdTask.id) {
                navigate(`/project/${createdTask.id}`);
                console.log("Project created with ID:", createdTask.id);
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
                slotProps={{
                    paper: {
                        sx: { width: isMobileScreen ? "100%" : "50%" }, // prendre la moitié de l'écran ou plein écran si petit écran
                    },
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
