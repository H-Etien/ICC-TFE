import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JSX } from "react";

import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

type Props = { route: string; method: string };

function LoginForm({ route, method }: Props): JSX.Element {
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    const navigate = useNavigate();

    // Envoi des données du formulaire au backend
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Pour empêcher le rechargement de la page
        event.preventDefault();

        setPasswordError(false);
        setPasswordErrorMessage("");
        setNameError(false);
        setNameErrorMessage("");

        const data = new FormData(event.currentTarget);
        const username = data.get("username");
        const password = data.get("password");

        console.log({
            username,
            password,
        });

        try {
            // Envoi des données de l'utilisateur au backend
            const response = await api.post(route, {
                username,
                password,
            });

            // Debug: show full response
            console.log("Login response:", response.status, response.data);

            if (response.data.access) {
                // Pour stocker les tokens dans le localStorage
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

                // Rediriger vers la page Home après la connexion
                navigate("/");
            }
        } catch (error: any) {
            // Si erreur d'identifiant ou mot de passe
            setPasswordError(true);
            setPasswordErrorMessage("Identifiant ou mot de passe incorrect");
        }
    };
    return (
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
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? "error" : "primary"}
                />
            </FormControl>
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            />

            <Button type="submit" fullWidth variant="contained">
                Connexion
            </Button>
            {/* <ForgotPassword open={open} handleClose={handleClose} />

        <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: "center" }}
        >
            Forgot your password?
        </Link> */}
        </Box>
    );
}
export default LoginForm;
