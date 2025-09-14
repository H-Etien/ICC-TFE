import React from "react";
import { useState, useEffect } from "react";
import Tag from "./Tag";

// Task composant pour afficher une tâche
function Task({
    task,
    onDelete,

    availableTags = [],
    onAddTag,
    onRemoveTag,
}) {
    // afficher la date sans les millisecondes
    const formattedDate = new Date(task.created_at).toLocaleString("fr-FR");

    // Filtrer les tags déjà associés à la tâche
    const filteredTags = availableTags.filter(
        (tagAlreadyUsed) =>
            !task.tags.find((tag) => tag.id === tagAlreadyUsed.id)
    );

    const [newTagId, setNewTagId] = useState(
        filteredTags[0] ? String(filteredTags[0].id) : ""
    );

    useEffect(() => {
        if (filteredTags[0]) setNewTagId(String(filteredTags[0].id));
    }, [filteredTags]);

    return (
        <div className="task-container">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-content">{task.content}</p>
            <p className="task-date">{formattedDate}</p>

            <div className="task-tags">
                Tags :
                {task.tags.map((tag) => (
                    <div key={tag.id} className="task-tag">
                        {tag.name}
                        <Tag key={tag.id} tag={tag} />

                        <button
                            type="button"
                            onClick={() => onRemoveTag(task.id, tag.id)}
                        >
                            Retirer le tag
                        </button>
                    </div>
                ))}
            </div>

            {filteredTags.length > 0 && (
                <div className="task-add-tag">
                    <select
                        value={newTagId}
                        onChange={(e) => setNewTagId(e.target.value)}
                    >
                        {
                            // Empêcher d'afficher les tags déjà associés à la tâche
                        }
                        {availableTags.map((tag) => {
                            if (task.tags.find((t) => t.id === tag.id)) {
                                return;
                            }
                            return (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            );
                        })}
                    </select>
                    <button
                        type="button"
                        onClick={() => {
                            //if (!newTagId) return;

                            onAddTag(task.id, parseInt(newTagId, 10));
                            setNewTagId("");
                        }}
                    >
                        Ajouter
                    </button>
                </div>
            )}

            <button className="task-delete" onClick={() => onDelete(task.id)}>
                Supprimer
            </button>
        </div>
    );
}

export default Task;
