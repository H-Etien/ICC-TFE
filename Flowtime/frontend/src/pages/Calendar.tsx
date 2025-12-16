import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import useTasks from "../hooks/useTasks";
import PageLayout from "../components/layout/PageLayout";
import Header from "../components/layout/Header";
import { CircularProgress, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Calendar(props: { disableCustomTheme?: boolean }) {
    const { tasks, loading, getAllUserTasks } = useTasks();
    const [events, setEvents] = useState<any[]>([]);
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        getAllUserTasks();
    }, [getAllUserTasks]);

    useEffect(() => {
        // Pour transformer les tâches en événements pour FullCalendar
        const TaskEvents = tasks
            .filter((task) => task.start_time) // Ne garder que les tâches avec une date de début
            .map((task) => ({
                id: task.id.toString(),
                title: task.title,
                start: task.start_time,
                end: task.end_time,
                extendedProps: {
                    projectId: task.project,
                },
            }));
        setEvents(TaskEvents);
    }, [tasks]);

    // Pour aller vers la TaskDetail en cliquant sur un event
    const handleEventClick = (clickInfo: any) => {
        const { projectId } = clickInfo.event.extendedProps;
        const taskId = clickInfo.event.id;
        navigate(`/project/${projectId}/task/${taskId}`);
    };

    return (
        <PageLayout {...props}>
            <Header pageTitle="Calendar" />

            {loading ? (
                <CircularProgress />
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        p: 2,
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        events={events}
                        eventClick={handleEventClick}
                        height="auto"
                        locale={i18n.language === "fr" ? frLocale : "en"}
                    />
                </Box>
            )}
        </PageLayout>
    );
}
