import React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [elementToTranslate, setElementToTranslate] =
        React.useState<null | HTMLElement>(null);
    const open = Boolean(elementToTranslate);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setElementToTranslate(event.currentTarget);
    };

    const handleClose = () => {
        setElementToTranslate(null);
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
                disableRipple
                sx={{ borderColor: "transparent" }}
                size="small"
                aria-controls={open ? "color-scheme-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
            >
                <LanguageIcon />
            </IconButton>
            <Menu
                anchorEl={elementToTranslate}
                open={open}
                onClose={handleClose}
            >
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
