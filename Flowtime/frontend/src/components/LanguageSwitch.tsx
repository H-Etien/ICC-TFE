import React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        handleClose();
    };

    return (
        <>
            <IconButton
                aria-label="language"
                onClick={handleClick}
                sx={{ borderColor: "transparent" }}
            >
                <LanguageIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    selected={i18n.language === "fr"}
                    onClick={() => handleLanguageChange("fr")}
                >
                    Français
                </MenuItem>
                <MenuItem
                    selected={i18n.language === "en"}
                    onClick={() => handleLanguageChange("en")}
                >
                    English
                </MenuItem>
            </Menu>
        </>
    );
}
