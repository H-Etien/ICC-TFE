import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JSX } from "react";
import react from "react";

import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../styles/AppTheme";
import ColorModeSelect from "../styles/ColorModeSelect";
import {
    GoogleIcon,
    FacebookIcon,
    SitemarkIcon,
} from "../components/CustomIcons";

type Props = { route: string; method: string };

function RegisterForm({ route, method }: Props): JSX.Element {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Pour déterminer si le formulaire est pour la connexion ou l'inscription
    const formMethod = method === "login" ? "Login" : "Register";

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
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage(
                "Password must be at least 6 characters long."
            );
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        if (!username.value || username.value.length < 1) {
            setNameError(true);
            setNameErrorMessage("Username is required.");
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
                    <FormLabel htmlFor="username">Identifiant</FormLabel>
                    <TextField
                        autoComplete="username"
                        name="username"
                        required
                        fullWidth
                        id="username"
                        placeholder="Jonh123"
                        error={nameError}
                        helperText={nameErrorMessage}
                        color={nameError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
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
                    <FormLabel htmlFor="password">Password</FormLabel>
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
                    label="I want to receive updates via email."
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                >
                    Sign up
                </Button>
            </Box>
            ;
        </>
    );
}

export default RegisterForm;
