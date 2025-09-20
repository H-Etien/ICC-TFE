import React from "react";
import Sidebar from "./Sidebar";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";

import frLocale from "@fullcalendar/core/locales/fr";

import "../styles/Calendar.css";

function Calendar() {
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
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            listPlugin,
                            multiMonthPlugin,
                        ]}
                        //initialView="dayGridMonth"

                        //largeur minimale en px pour afficher la vue multiMonth
                        multiMonthMinWidth={400}
                        views={
                            ({
                                multiMonthYear: {
                                    type: "multiMonth",
                                    duration: { months: 12 },
                                    buttonText: "Année",
                                },
                            },
                            {
                                listDay: { buttonText: "Liste jour" },
                            })
                        }
                        initialView="multiMonthYear"
                        locales={[frLocale]}
                        locale="fr"
                        height="80vh"
                        // nommer les boutons en français
                        // buttonText={{
                        //     dayGridYear: "Année",
                        //     multiMonthYear: "Année",
                        //     dayGridMonth: "Mois",
                        //     timeGridWeek: "Semaine",
                        //     timeGridDay: "Jour",
                        //     listDay: "Liste jour",
                        //     listWeek: "Liste semaine",
                        //     today: "Aujourd'hui",
                        // }}
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
                            right: "dayGridYear,dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear,listDay,listWeek",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
export default Calendar;
