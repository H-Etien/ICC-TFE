import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import Task from "../components/Task";
import Sidebar from "../components/Sidebar";
import CreateTask from "../components/CreateTask";

import useTimer from "../hooks/useTimer";
import "../styles/AllTasks.css";

function AllTasks() {
    const [tasks, setTasks] = useState([]);
    const [tags, setTags] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    // filtre local simple
    const [filter, setFilter] = useState("all");

    const [query, setQuery] = useState("");

    useEffect(() => {
        getTags();
        getTasks();
    }, []);

    // Task à afficher selon le filtre
    const displayedTasks = useMemo(() => {
        const lower_query = query.trim().toLowerCase();
        return tasks
            .filter((task) => {
                if (filter === "all") return true;
                if (filter === "completed") return task.is_completed;
                return !task.is_completed;
            })
            .filter((task) => {
                if (!lower_query) return true;
                return (task.title || "").toLowerCase().includes(lower_query);
            });
    }, [tasks, filter, query]);

    const updateTaskTime = (taskId, seconds) => {
        if (!taskId) return;
        api.patch(`/api/tasks/${taskId}/`, { time_spent: seconds })
            .then(() => getTasks())
            .catch((err) => console.error("updateTaskTime error:", err));
    };

    // useTimer centralise l'interval et le calcul d'elapsed
    const {
        activeTimerTaskId,
        timerElapsed,
        startTimer,
        stopTimer,
        onToggleTimer,
        isTimerDisabled,
    } = useTimer(updateTaskTime);

    const getTasks = () => {
        api.get("/api/tasks/").then((res) => {
            setTasks(res.data);
            console.log(res.data);
        });
    };

    const deleteTask = (id) => {
        api.delete(`/api/tasks/${id}/`)
            .then(() => getTasks())
            .catch((err) => console.error(err));
    };
    const getTags = () => {
        api.get("/api/tags/")
            .then((res) => setTags(res.data))
            .catch((err) => console.error(err));
    };

    const handleTagChange = (e) => {
        const tagId = parseInt(e.target.value);
        if (e.target.checked) {
            setSelectedTags([...selectedTags, tagId]);
        } else {
            setSelectedTags(selectedTags.filter((id) => id !== tagId));
        }
    };

    const createTask = (e) => {
        e.preventDefault();

        // Tous les objets de la tâche
        const newTask = {
            title,
            content,

            tag_ids: selectedTags,
        };
        if (startTime) newTask.start_time = new Date(startTime).toISOString();
        if (endTime) newTask.end_time = new Date(endTime).toISOString();

        //api.post("/api/tasks/", { title, content, tag_ids: selectedTags })
        api.post("/api/tasks/", newTask)
            .then(() => {
                setTitle("");
                setContent("");
                setStartTime("");
                setEndTime("");
                setSelectedTags([]);
                getTasks();
            })
            .catch((err) => console.error(err));
    };

    const addTagToTask = (taskId, tagId) => {
        const task = tasks.find((t) => t.id === taskId);
        const currentIds = task.tags.map((t) => t.id);

        if (currentIds.includes(tagId)) return;

        const newTagIds = [...currentIds, tagId];

        api.patch(`/api/tasks/${taskId}/`, { tag_ids: newTagIds })
            .then(() => getTasks())
            .catch((err) => console.error("addTagToTask error:", err));
    };

    // Retirer un tag d'une tâche
    const unlinkTagFromTask = (taskId, tagId) => {
        const task = tasks.find((t) => t.id === taskId);
        const currentIds = task.tags.map((t) => t.id);

        const newIds = currentIds.filter((id) => id !== tagId);

        api.patch(`/api/tasks/${taskId}/`, { tag_ids: newIds })
            .then(() => getTasks())
            .catch((err) => console.error("unlinkTagFromTask error:", err));
    };

    const updateTask = (taskId, taskContent) => {
        // convertit les datetime-local (si fournis sous forme locale) en ISO YYYY-MM-DDTHH:MM
        api.patch(`/api/tasks/${taskId}/`, taskContent)
            .then(() => getTasks())
            .catch((err) => {
                console.error("erreur updateTask: ", err);
            });
    };

    return (
        <div className="task-all-container">
            <Sidebar
                onTagsUpdated={() => {
                    getTags();
                    getTasks();
                }}
            />
            <div className="task-main">
                <h1>Toutes les tâches</h1>

                <div className="task-filters">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => setFilter("all")}
                    >
                        Tout
                    </button>
                    <button
                        className={filter === "active" ? "active" : ""}
                        onClick={() => setFilter("active")}
                    >
                        En cours
                    </button>
                    <button
                        className={filter === "completed" ? "active" : ""}
                        onClick={() => setFilter("completed")}
                    >
                        Terminés
                    </button>
                </div>

                <div className="task-search-container">
                    <input
                        type="search"
                        placeholder="Rechercher par titre..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="task-search"
                    />
                </div>

                <div className="tasks-list">
                    {displayedTasks.map((task) => (
                        <Task
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onAddTag={addTagToTask}
                            onRemoveTag={unlinkTagFromTask}
                            availableTags={tags}
                            onUpdateTask={updateTask}
                            onUpdateTimeSpent={updateTaskTime}
                            isTimeRunning={activeTimerTaskId === task.id}
                            elapsed={
                                activeTimerTaskId === task.id ? timerElapsed : 0
                            }
                            isDisabled={isTimerDisabled(task.id)}
                            onToggleTimer={() => onToggleTimer(task.id)}
                        />
                    ))}
                </div>

                <hr />

                <CreateTask
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    startTime={startTime}
                    setStartTime={setStartTime}
                    endTime={endTime}
                    setEndTime={setEndTime}
                    tags={tags}
                    selectedTags={selectedTags}
                    handleTagChange={handleTagChange}
                    createTask={createTask}
                />
            </div>
        </div>
    );
}
export default AllTasks;
