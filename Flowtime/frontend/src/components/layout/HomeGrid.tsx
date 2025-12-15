import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../ui/Copyright";

import ProjectGrid from "./ProjectGrid";

export default function HomeGrid() {
    return (
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}></Typography>
            <ProjectGrid />

            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Details
            </Typography>

            <Copyright sx={{ my: 4 }} />
        </Box>
    );
}
