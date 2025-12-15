import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "../ui/SelectContent";
import MenuContent from "../menu/MenuContent";
import CardAlert from "../ui/CardAlert";
import OptionsMenu from "../menu/OptionsMenu";
import useUser from "../../hooks/useUser";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: "border-box",
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: "border-box",
    },
});

export default function SideMenu() {
    const { user } = useUser();

    const displayName = user?.username || "Utilisateur";
    const displayEmail = user?.email || "email@example.com";

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: "none", md: "block" },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: "background.paper",
                },
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    lineHeight: "16px",
                    p: 2,
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                }}
            >
                Flowtime
            </Typography>
            <Divider />
            <Box
                sx={{
                    overflow: "auto",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Naviguer à travers les différentes applications */}
                <MenuContent />
            </Box>
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: "center",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Avatar
                    sizes="small"
                    alt={displayName}
                    src="/static/images/avatar/7.jpg"
                    sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ mr: "auto" }}>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, lineHeight: "16px" }}
                    >
                        {displayName}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                    >
                        {displayEmail}
                    </Typography>
                </Box>
            </Stack>
        </Drawer>
    );
}
