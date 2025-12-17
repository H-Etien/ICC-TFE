import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";

import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MenuContent() {
    const { t } = useTranslation();
    const location = useLocation();

    const mainListItems = [
        { text: t("navigation.home"), icon: <HomeRoundedIcon />, to: "/" },
        {
            text: t("navigation.projects"),
            icon: <AddToPhotosIcon />,
            to: "/project",
        },
        {
            text: t("navigation.calendar"),
            icon: <CalendarMonthIcon />,
            to: "/calendar",
        },
        {
            text: t("navigation.ai_generator"),
            icon: <AssignmentRoundedIcon />,
            to: "/ai-generator",
        },
        {
            text: "Premium",
            icon: <StarIcon />,
            to: "/premium",
        },
    ];

    const secondaryListItems = [
        {
            text: t("navigation.settings"),
            icon: <SettingsRoundedIcon />,
            to: "/settings",
        },
        {
            text: t("navigation.about"),
            icon: <InfoRoundedIcon />,
            to: "/about",
        },
        { text: t("navigation.logout"), icon: <LogoutIcon />, to: "/logout" },
    ];

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton
                            component={RouterLink}
                            to={item.to}
                            selected={location.pathname === item.to}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton
                            component={RouterLink}
                            to={item.to}
                            selected={location.pathname === item.to}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
