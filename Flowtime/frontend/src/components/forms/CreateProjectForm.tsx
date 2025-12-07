import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DoneIcon from "@mui/icons-material/Done";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { useState, useEffect } from "react";

import useProjects from "../../hooks/useProjects";

export default function CreateProjectForm({}) {
    const [open, setOpen] = useState(false);
    const { createProject } = useProjects();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createProject({
            title: event.currentTarget.title.value,
            description: event.currentTarget.description.value,
        });
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
                Ouvrir drawer
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
