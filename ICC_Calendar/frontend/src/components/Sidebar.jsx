import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import api from "../api";
import Tag from "./Tag";

//import "./Sidebar.css";

function Sidebar({ onTagsUpdated }) {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        getTags();
    }, []);

    const getTags = () => {
        api.get("/api/tags/")
            .then((res) => setTags(res.data))
            .catch((err) => console.error(err));
    };

    const createTag = (e) => {
        e.preventDefault();
        api.post("/api/tags/", { name: newTag })
            .then(() => {
                setNewTag("");
                getTags();

                // onTagsUpdated est une fonction pour rafraîchir la liste des tags dans Home
                if (typeof onTagsUpdated === "function") onTagsUpdated();
            })
            .catch((err) => console.error(err));
    };

    const deleteTag = (id) => {
        // à ajouter si on veut confirmer la suppression
        /* if (!confirm("Supprimer cette étiquette ?")) return; */
        api.delete(`/api/tags/${id}/`)
            .then(() => {
                // rafraîchir la liste des tags
                getTags();
                if (typeof onTagsUpdated === "function") onTagsUpdated();
            })
            .catch((err) => console.error("deleteTag error:", err));
    };

    // Pour la déconnexion
    const handleLogout = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Retirer les tokens du site pour déconnecter l'utilisateur
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);

        // forcer la navigation + reload
        // le useNavigate ne fonctionne pas sans un reload
        window.location.href = "/";
    };

    return (
        <>
            <div className="top">
                <ul>
                    <li>
                        <Link to="/">Accueil</Link>
                    </li>
                    <li>
                        <Link to="/login">Connexion</Link>
                    </li>
                    <li>
                        <Link to="/tasks">Tâches</Link>
                    </li>
                    <li>
                        <Link to="/tags">Étiquettes</Link>
                    </li>
                    <li>
                        <Link to="/about">À propos</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                        <button type="button" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </li>
                </ul>
            </div>

            <div className="search">
                <input type="text" placeholder="Rechercher..." />
            </div>

            <div className="center">
                <h2>Tâches à faire</h2>
                <ul>
                    <li>Aujourd'hui</li>
                    <li>Cette semaine</li>
                    <li>Calendrier</li>
                    <li>Important</li>
                    <li>Notes</li>
                </ul>
            </div>

            <div className="title">Catégorie</div>
            <ul>
                <li>Personnel</li>
                <li>Travail</li>
                <li>Loisirs</li>
            </ul>

            <div className="title">Tags</div>
            <div className="tags-container"></div>
            <div className="tags">
                {tags.map((tag) => (
                    <Tag key={tag.id} tag={tag} onDelete={deleteTag} />
                ))}
            </div>
            <div className="tags">
                <div className="tag add-tag">
                    <form className="tags add-tag-form" onSubmit={createTag}>
                        <input
                            type="text"
                            placeholder="Ajouter un tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                        />
                        <button type="submit">Ajouter</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
