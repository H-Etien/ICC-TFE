import { useState, useEffect } from "react";

import api from "../api";
import Task from "../components/Task";
import Tag from "../components/Tag";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";

import "../styles/Home.css";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        getTasks();
        getTags();
    }, []);

    const getTasks = () => {
        api.get("/api/tasks/").then((res) => setTasks(res.data));
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
        api.post("/api/tasks/", { title, content, tag_ids: selectedTags })
            .then(() => {
                setTitle("");
                setContent("");
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

    const createTag = (e) => {
        e.preventDefault();
        api.post("/api/tags/", { name: newTag })
            .then(() => {
                setNewTag("");
                getTags();
            })
            .catch((err) => console.error(err));
    };

    const deleteTag = (id) => {
        api.delete(`/api/tags/${id}/`)
            .then(() => {
                // rafraîchir la liste des tags et des tâches
                getTags();
                getTasks();
            })
            .catch((err) => {
                console.error("Erreur suppression tag :", err);
            });
    };

    // Retourne toutes les tâches et le formulaire de création
    return (
        // onTagsUpdated est une fonction pour rafraîchir la liste des tags dans Home
        <div className="home-container">
            <Sidebar onTagsUpdated={getTags} />

            <hr />
            <div>
                <h2>Tâches</h2>
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        onDelete={deleteTask}
                        onAddTag={addTagToTask}
                        onRemoveTag={unlinkTagFromTask}
                        availableTags={tags}
                    />
                ))}
            </div>

            <hr />

            <form onSubmit={createTask}>
                <input
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <textarea
                    placeholder="Contenu"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <br />

                <div>
                    {tags.map((tag) => (
                        <label key={tag.id}>
                            <input
                                type="checkbox"
                                value={tag.id}
                                checked={selectedTags.includes(tag.id)}
                                onChange={handleTagChange}
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>

                <br />
                <button type="submit">Créer</button>
            </form>

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
