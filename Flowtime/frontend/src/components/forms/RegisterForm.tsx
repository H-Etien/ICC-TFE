import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { JSX } from "react";

import api from "../../api";

import * as React from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

type Props = { route: string; method: string };

function RegisterForm({ route, method }: Props): JSX.Element {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    // Validation des champs du formulaire
    const validateInputs = () => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById(
            "password"
        ) as HTMLInputElement;
        const username = document.getElementById(
            "username"
        ) as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage(t("auth.invalid_email"));
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage(t("auth.password_too_short"));
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        if (!username.value || username.value.length < 1) {
            setNameError(true);
            setNameErrorMessage(t("auth.username_required"));
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage("");
        }

        return isValid;
    };

    // Envoi des données du formulaire au backend
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Pour empêcher le rechargement de la page
        event.preventDefault();

        if (nameError || emailError || passwordError) {
            // Pour empêcher le rechargement de la page
            event.preventDefault();
            return;
        }

        const data = new FormData(event.currentTarget);
        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");

        console.log({
            username,
            email,
            password,
        });

        try {
            // Envoi des données de l'utilisateur au backend
            const response = await api.post(route, {
                username,
                email,
                password,
            });

            // Si l'inscription est un succès, rediriger vers la page de connexion
            navigate("/login");
        } catch (error: any) {
            console.error("Registration Error :", error);

            // Erreurs renvoyées par le backend, comme les doublons
            const apiErrors = error.response.data;
            if (apiErrors) {
                if (apiErrors.username) {
                    setNameError(true);
                    setNameErrorMessage(apiErrors.username[0]);
                }
                if (apiErrors.email) {
                    setEmailError(true);
                    setEmailErrorMessage(apiErrors.email[0]);
                }
                if (apiErrors.password) {
                    setPasswordError(true);
                    setPasswordErrorMessage(apiErrors.password[0]);
                }
            }
        }
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <FormControl>
                    <FormLabel htmlFor="username">
                        {t("auth.username")}
                    </FormLabel>
                    <TextField
                        autoComplete="username"
                        name="username"
                        required
                        fullWidth
                        id="username"
                        placeholder="John123"
                        error={nameError}
                        helperText={nameErrorMessage}
                        color={nameError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="email">{t("auth.email")}</FormLabel>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        placeholder="your@email.com"
                        name="email"
                        autoComplete="email"
                        variant="outlined"
                        error={emailError}
                        helperText={emailErrorMessage}
                        color={passwordError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">
                        {t("auth.password")}
                    </FormLabel>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        color={passwordError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControlLabel
                    control={
                        <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label={t("auth.receive_updates")}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                >
                    {t("auth.sign_up_button")}
                </Button>
            </Box>
            ;
        </>
    );
}

export default RegisterForm;
