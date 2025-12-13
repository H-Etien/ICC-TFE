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
    TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { useTheme } from "@mui/material/styles";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function CreateTaskForm({
    projectId,
    createTask,
}: {
    projectId: string | undefined;
    createTask: ({
        projectId,
        payload,
    }: {
        projectId: number;
        payload: { title: string; content: string; assigned_to?: number };
    }) => Promise<any>;
}) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const title = String(data.get("title") || "");
        const content = String(data.get("content") || "");
        const assignedTo = data.get("assigned_to"); // Peut être null

        // Envoyer la requête pour créer la Task
        try {
            const createdTask = await createTask({
                projectId: Number(projectId),
                payload: {
                    title: title,
                    content: content,
                    start_time: startDate ? startDate.toISOString() : undefined,
                    end_time: endDate ? endDate.toISOString() : undefined,
                    assigned_to: assignedTo ? Number(assignedTo) : undefined,
                },
            });
            console.log(
                "Created task:",
                startDate.toISOString(),
                endDate.toISOString(),
                createdTask
            );
            setOpen(false);
        } catch (error) {
            console.error("Error creating task:", error);
            return;
        }
    };

    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    // pour rendre le drawer responsive, si écran mobile, on le met en full screen
    const theme = useTheme();
    const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        if (open === true) {
            setNameError(false);
            setNameErrorMessage("");
        }
    }, [open]);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Créer une tâche
            </Button>
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
                    <h2>Créer une nouvelle tâche</h2>
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
                                Titre de la tâche
                            </FormLabel>
                            <TextField
                                autoComplete="off"
                                name="title"
                                required
                                fullWidth
                                id="title"
                                placeholder="Ex: Commencer un programme"
                                error={nameError}
                                helperText={nameErrorMessage}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="content">Description</FormLabel>
                            <TextareaAutosize
                                name="content"
                                id="content"
                                required
                                minRows={4}
                                maxRows={8}
                                placeholder="Description de la tâche"
                                style={{
                                    // pour avoir le même style que les TextField de MUI
                                    width: "100%",
                                    boxSizing: "border-box",
                                    borderRadius: 4,
                                    fontFamily:
                                        "Roboto, Helvetica, Arial, sans-serif",
                                    fontSize: "0.875rem",
                                }}
                                aria-label="Description de la tâche"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="assigned_to">
                                Assigner à (ID utilisateur, optionnel)
                            </FormLabel>
                            <TextField
                                name="assigned_to"
                                placeholder="Ex: 1"
                                type="number"
                                id="assigned_to"
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>

                        {/* Date et heure (optionnel)  */}
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterslocale="fr"
                        >
                            <Stack spacing={2}>
                                <DateTimePicker
                                    label="Date de début (optionnel)"
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    minutesStep={5}
                                    onChange={(newValue) =>
                                        setStartDate(newValue)
                                    }
                                    value={startDate}
                                />
                                <DateTimePicker
                                    label="Date de fin (optionnel)"
                                    ampm={false}
                                    format="DD/MM/YYYY HH:mm"
                                    minutesStep={5}
                                    onChange={(newValue) =>
                                        setEndDate(newValue)
                                    }
                                    value={endDate}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setStartDate(null);
                                        setEndDate(null);
                                    }}
                                >
                                    Supprimer la date
                                </Button>
                            </Stack>
                        </LocalizationProvider>

                        {/* Confirmer ou annuler la création de la Task */}
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
            </Drawer>
        </>
    );
}
