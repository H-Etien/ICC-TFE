import React from "react";

// Task composant pour afficher une tâche
function Task({ task, onDelete }) {
    // afficher la date sans les millisecondes
    const formattedDate = new Date(task.created_at).toLocaleString("fr-FR");

    return (
        <div className="task-container">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-content">{task.content}</p>
            <p className="task-date">{formattedDate}</p>

            <div className="task-tags">
                Tags :
                {task.tags.map((tag) => (
                    <span key={tag.id} className="task-tag">
                        {tag.name}
                    </span>
                ))}
            </div>

            <button className="task-delete" onClick={() => onDelete(task.id)}>
                Supprimer
            </button>
        </div>
    );
}

export default Task;
