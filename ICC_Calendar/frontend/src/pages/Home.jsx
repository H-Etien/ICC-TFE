import { useState, useEffect } from "react";

import api from "../api";
import Task from "../components/Task";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        getTask();
        getTags();
    }, []);

    const getTask = () => {
        api.get("/api/tasks/")
            .then((res) => setTasks(res.data))
            .catch((err) => alert(err));
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

    const createTag = (e) => {
        e.preventDefault();
        api.post("/api/tags/", { name: newTag })
            .then(() => {
                setNewTag("");
                getTags();
            })
            .catch((err) => console.error(err));
    };

    // Retourne toutes les tâches et le formulaire de création
    return (
        <>
            <div>
                <h2>Tâches</h2>
                {tasks.map((task) => (
                    <Task key={task.id} task={task} onDelete={deleteTask} />
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

            <hr />

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
        </>
    );
}

export default Home;
