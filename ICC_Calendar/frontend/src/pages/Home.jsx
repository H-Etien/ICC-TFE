import { useState, useEffect } from "react";

import api from "../api";
import Task from "../components/Task";
import Tag from "../components/Tag";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";
import CreateTask from "../components/CreateTask";

import "../styles/Home.css";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    // filtre: 'all' | 'active' | 'completed'
    const [filter, setFilter] = useState("all");

    // Task à afficher selon le filtre
    const displayedTasks = tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "completed") return task.is_completed;
        // Task non complétée
        return !task.is_completed;
    });

    // ID de la tâche en cours de minuterie pour avoir un seul minuteur à la fois
    const [activeTimerTaskId, setActiveTimerTaskId] = useState(null);
    const [activeStartTime, setActiveStartTime] = useState(null);
    const [timerElapsed, setTimerElapsed] = useState(0);

    useEffect(() => {
        getTasks();
        getTags();
    }, []);

    useEffect(() => {
        let interval;
        if (activeTimerTaskId) {
            interval = setInterval(() => {
                if (activeStartTime) {
                    const elapsed = Math.floor(
                        (Date.now() - new Date(activeStartTime).getTime()) /
                            1000
                    );
                    setTimerElapsed(elapsed);
                }
            }, 1000);
        } else {
            setTimerElapsed(0);
        }
        return () => clearInterval(interval);
    }, [activeTimerTaskId, activeStartTime]);

    const onToggleTimer = (taskId) => {
        if (taskId && activeTimerTaskId !== taskId) startTimer(taskId);
        else stopTimer(activeTimerTaskId);
    };

    const disabledTimer = (taskId) =>
        activeTimerTaskId !== null && activeTimerTaskId !== taskId;

    const stopTimer = async (taskId) => {
        const seconds = timerElapsed;
        if (taskId) {
            api.patch(`/api/tasks/${taskId}/`, { time_spent: seconds })
                .then(() => getTasks())
                .catch((err) => console.error(err));
        }
        setActiveTimerTaskId(null);
        setActiveStartTime(null);
        setTimerElapsed(0);
    };

    const startTimer = (taskId) => {
        setActiveTimerTaskId(taskId);
        setActiveStartTime(new Date().toISOString());
        setTimerElapsed(0);
    };

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

    const updateTaskTime = (id, seconds) => {
        api.patch(`/api/tasks/${id}/`, { time_spent: seconds })
            .then(() => getTasks())
            .catch((err) => console.error(err));
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

    // Retourne toutes les tâches et le formulaire de création
    return (
        // onTagsUpdated est une fonction pour rafraîchir la liste des tags dans Home
        <div className="home-container">
            <Sidebar
                //prop callback pour rafraîchir les tâches et les tags
                onTagsUpdated={() => {
                    getTags();
                    getTasks();
                }}
            />
            <div className="tasks-section">
                <div className="task-filters">
                    <button
                        type="button"
                        className={filter === "all" ? "active" : ""}
                        onClick={() => setFilter("all")}
                    >
                        Tout
                    </button>
                    <button
                        type="button"
                        className={filter === "active" ? "active" : ""}
                        onClick={() => setFilter("active")}
                    >
                        En cours
                    </button>
                    <button
                        type="button"
                        className={filter === "completed" ? "active" : ""}
                        onClick={() => setFilter("completed")}
                    >
                        Terminés
                    </button>
                </div>

                <hr />

                <div>
                    <h2>Tâches</h2>
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
                            isDisabled={disabledTimer(task.id)}
                            onToggleTimer={() => onToggleTimer(task.id)}
                        />
                    ))}
                </div>
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
            {/* 
            <form onSubmit={createTask}>
                <input
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <hr />
                <textarea
                    placeholder="Contenu"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <hr />

                <div className="tache-debut">
                    Début
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <hr />
                <div className="tache-fin">
                    Fin
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>

                <hr />

                <div>
                    {tags.map((tag) => (
                        <div key={tag.id}>
                            <input
                                type="checkbox"
                                value={tag.id}
                                checked={selectedTags.includes(tag.id)}
                                onChange={handleTagChange}
                            />
                            {tag.name}
                        </div>
                    ))}
                </div>

                <br />
                <button type="submit">Créer</button>
            </form> */}

            {/* 
            // Création de tags, déjà dans Sidebar.jsx 

            <form onSubmit={createTag}>
                <div>
                    text
                    {tags.map((tag) => (
                        <label key={tag.id}>
                            <input
                                type="checkbox"
                                value={tag.id}
                                onChange={(e) =>
                                    handleTagChange(e.target.value)
                                }
                            />
                            {tag.name}
                        </label>
                    ))}
                    <br />
                    <input
                        type="text"
                        placeholder="Nouvelle étiquette"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                    />
                    <button type="submit">Créer</button>
                </div>
            </form>
            */}
        </div>
    );
}

export default Home;
