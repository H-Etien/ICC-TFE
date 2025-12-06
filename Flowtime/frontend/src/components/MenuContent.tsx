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

import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const mainListItems = [
    { text: "Home", icon: <HomeRoundedIcon />, to: "/" },
    { text: "Analytics", icon: <AnalyticsRoundedIcon />, to: "/analytics" },
    { text: "Clients", icon: <PeopleRoundedIcon />, to: "/clients" },
    { text: "Tasks", icon: <AssignmentRoundedIcon />, to: "/tasks" },
];

const secondaryListItems = [
    { text: "Settings", icon: <SettingsRoundedIcon /> },
    { text: "About", icon: <InfoRoundedIcon /> },
    { text: "Feedback", icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
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
                            // Pour naviguer dans les différents liens sans recharger la page
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
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
