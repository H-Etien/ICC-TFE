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
    Autocomplete,
    Chip,
    CircularProgress,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import useProjects from "../../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function CreateProjectForm({}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { createProject } = useProjects();
    const navigate = useNavigate();

    // Pour chercher et ajouter les membres au projet
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    // Pour empêcher de créer le Project si ces champs sont vides
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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
                members: selectedMembers.map((m) => m.id), // membre Id, pas username
            });
            setOpen(false);
            setSelectedMembers([]); // Réinitialiser les membres
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

    // Fonction pour chercher les utilisateurs
    const handleSearchUsers = useCallback(async (inputValue: string) => {
        setSearchInput(inputValue);

        if (inputValue.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await api.get("/api/user/search/", {
                params: { search: inputValue },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Fonction pour ajouter un membre
    const handleAddMember = (event: any, value: any) => {
        if (value && !selectedMembers.find((m) => m.id === value.id)) {
            setSelectedMembers([...selectedMembers, value]);
            setSearchInput("");
            setSearchResults([]);
        }
    };

    // Fonction pour retirer un membre
    const handleRemoveMember = (memberId: number) => {
        setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId));
    };

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
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setNameError(false);
                                    setNameErrorMessage("");
                                }}
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>

                        {/* Ajouter des membres au projet: */}
                        <FormControl>
                            <FormLabel>Ajouter des membres</FormLabel>
                            <Autocomplete
                                options={searchResults}
                                getOptionLabel={(option) =>
                                    `${option.username} (${option.email})`
                                }
                                loading={searchLoading}
                                inputValue={searchInput}
                                onInputChange={(event, value) =>
                                    handleSearchUsers(value)
                                }
                                onChange={handleAddMember}
                                clearIcon={<CloseIcon fontSize="small" />}
                                popupIcon={<ExpandMoreIcon fontSize="small" />}
                                sx={{
                                    "& .MuiAutocomplete-popupIndicator": {
                                        width: 2,
                                        height: 2,
                                        padding: 2,
                                        borderRadius: 6,
                                        backgroundColor: "transparent",
                                    },
                                    "& .MuiAutocomplete-clearIndicator": {
                                        width: 2,
                                        height: 2,
                                        padding: 2,
                                        borderRadius: 6,
                                        backgroundColor: "transparent",
                                        marginRight: 1,
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Chercher par username..."
                                    />
                                )}
                            />
                        </FormControl>

                        {/* Afficher les membres sélectionnés */}
                        {selectedMembers.length > 0 && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Membres ajoutés:
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    {selectedMembers.map((member) => (
                                        <Chip
                                            key={member.id}
                                            label={member.username}
                                            onDelete={() =>
                                                handleRemoveMember(member.id)
                                            }
                                            color="grey"
                                            variant="outlined"
                                            sx={{
                                                height: 40,
                                                padding: 2,
                                                borderRadius: 2,
                                            }}
                                            deleteIcon={
                                                <CloseIcon fontSize="big" />
                                            }
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}

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
                                disabled={!title.trim() || !description.trim()}
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
