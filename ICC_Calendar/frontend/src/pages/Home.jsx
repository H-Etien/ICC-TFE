import { useState, useEffect } from "react";

import api from "../api";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getTask();
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
                    alert("Task deleted successfully");
                } else {
                    alert("Failed to delete task");
                }
                getTask();
            })
            .catch((err) => alert(err));
    };

    const createTask = (e) => {
        e.preventDefault();
        api.post("/api/task/", { title, content })
            .then((res) => {
                if (res.status === 201) {
                    alert("Task created successfully");
                } else {
                    alert("Failed to create task");
                }
                getTask();
            })
            .catch((err) => alert(err));
    };

    return (
        <>
            <div>
                <h2>Tâche</h2>
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
                <button type="submit" value="Submit">
                    Créer
                </button>
            </form>
        </>
    );
}

export default Home;
