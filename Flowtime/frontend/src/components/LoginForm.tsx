import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "../components/ForgotPassword";
import AppTheme from "../styles/AppTheme";
import ColorModeSelect from "../styles/ColorModeSelect";
import {
    GoogleIcon,
    FacebookIcon,
    SitemarkIcon,
} from "../components/CustomIcons";

function LoginForm({ route, method }: { route: string; method: string }) {
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

    if (method === "login") {
        // Pour stocker les tokens dans le localStorage
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

        // Rediriger vers la page Home après la connexion
        navigate("/");
    }

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
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
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
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
        >
            Connexion
        </Button>
        <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: "center" }}
        >
            Forgot your password?
        </Link>
    </Box>;
}
export default LoginForm;
