import React from "react";
import Sidebar from "./Sidebar";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import frLocale from "@fullcalendar/core/locales/fr";

import "../styles/Calendar.css";

const Calendar = () => {
    return (
        <div className="calendar-container">
            <Sidebar />

            <div className="calendar-content">
                <div className="top">
                    <h1 className="calendar-title">Calendrier</h1>
                </div>

                <div className="middle">
                    <FullCalendar
                        className="calendar-full"
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        locales={[frLocale]}
                        locale="fr"
                        height="80vh"
                        events={[
                            { title: "Événement 1", start: "2025-09-01" },
                            {
                                title: "Événement 2",
                                start: "2025-09-05T12:00:00",
                                end: "2025-09-06T14:00:00",
                            },
                            {
                                title: "All day",
                                start: "2025-09-10",
                                allDay: true,
                            },
                        ]}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridYear,dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default Calendar;
