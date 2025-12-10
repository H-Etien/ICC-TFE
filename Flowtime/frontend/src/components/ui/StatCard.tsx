import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

import IconButton from "@mui/material/Icon";
import DeleteIcon from "@mui/icons-material/Delete";
import useProjects from "../../hooks/useProjects";
import { Link } from "react-router-dom";

export type StatCardProps = {
    title: string;
    description: string;
};

function getDaysInMonth(month: number, year: number) {
    const date = new Date(year, month, 0);
    const monthName = date.toLocaleDateString("en-US", {
        month: "short",
    });
    const daysInMonth = date.getDate();
    const days = [];
    let i = 1;
    while (days.length < daysInMonth) {
        days.push(`${monthName} ${i}`);
        i += 1;
    }
    return days;
}

export default function StatCard({
    title,
    description,
}: // interval,
// trend,
// data,
StatCardProps) {
    const theme = useTheme();
    const daysInWeek = getDaysInMonth(4, 2024);

    const trendColors = {
        up:
            theme.palette.mode === "light"
                ? theme.palette.success.main
                : theme.palette.success.dark,
        down:
            theme.palette.mode === "light"
                ? theme.palette.error.main
                : theme.palette.error.dark,
        neutral:
            theme.palette.mode === "light"
                ? theme.palette.grey[400]
                : theme.palette.grey[700],
    };

    const labelColors = {
        up: "success" as const,
        down: "error" as const,
        neutral: "default" as const,
    };

    // const color = labelColors[trend];
    // const chartColor = trendColors[trend];
    const trendValues = { up: "+25%", down: "-25%", neutral: "+5%" };

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                flexGrow: 1,
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}
