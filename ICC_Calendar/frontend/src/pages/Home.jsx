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
        api.get("/api/task/")
            .then((res) => res.data)
            .then((data) => {
                setTasks(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteTask = (id) => {
        api.delete(`/api/task/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    console.log("Task deleted successfully");
                } else {
                    alert("Failed to delete task");
                }
                getTask();
            })
            .catch((err) => alert(err));
    };

    const getTags = () => {
        api.get("/api/tags/")
            .then((res) => setTags(res.data))
            .catch((err) => console.error("Error fetching tags:", err));
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
        api.post("/api/task/", { title, content, tags: selectedTags })
            .then((res) => {
                if (res.status === 201) {
                    console.log("Task created successfully");
                } else {
                    alert("Failed to create task");
                }
                getTask();
            })
            .catch((err) => alert(err));
    };

    const createTag = (e) => {
        e.preventDefault();
        api.post("/api/tags/", { name: newTag })
            .then((res) => {
                if (res.status === 201) {
                    console.log("Tag created successfully");
                    getTags(); // Refresh the tag list
                    setNewTag(""); // Clear the input
                } else {
                    alert("Failed to create tag");
                }
            })
            .catch((err) => alert(err));
    };

    // Retourne toutes les tâches et le formulaire de création
    return (
        <>
            <div>
                <h2>Tâche</h2>
                {tasks.map((task) => (
                    <Task key={task.id} task={task} onDelete={deleteTask} />
                ))}
            </div>
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

                {/* Tag*/}
                <div>
                    {tags.map((tag) => (
                        <label key={tag.id}>
                            <input
                                type="checkbox"
                                value={tag.id}
                                onChange={handleTagChange}
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>

                <br />
                <button type="submit" value="Submit">
                    Créer
                </button>
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
                    <button type="submit" value="Submit">
                        Créer
                    </button>
                </div>
            </form>
        </>
    );
}

export default Home;
