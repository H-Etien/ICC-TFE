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
    onUpdateTask,
    onUpdateTimeSpent,
    isTimeRunning = false,
    elapsed = 0,
    onToggleTimer,

    isDisabled = false,
}) {
    // afficher la date sans les millisecondes
    const formattedDate = new Date(task.created_at).toLocaleString("fr-FR");

    // Filtrer les tags déjà associés à la tâche
    const filteredTags = availableTags.filter(
        (tag) => !task.tags.find((tagInTask) => tagInTask.id === tag.id)
    );
    const [newTagId, setNewTagId] = useState(
        filteredTags[0] ? String(filteredTags[0].id) : ""
    );
    const [editStart, setEditStart] = useState(
        //toDatetimeLocal(task.start_time)
        toDatetimeLocal(task.start_time)
    );
    const [editEnd, setEditEnd] = useState(
        //toDatetimeLocal(task.end_time)
        toDatetimeLocal(task.end_time)
    );

    // nouvel état pour savoir si l'utilisateur édite les dates localement
    const [isDateEdited, setIsDateEdited] = useState(false);

    useEffect(() => {
        if (filteredTags[0]) setNewTagId(String(filteredTags[0].id));
        // ne réinitialise les champs de date que si l'utilisateur n'a pas commencé
        // à les éditer localement (évite d'écraser la saisie quand on clique ailleurs)
        if (!isDateEdited) {
            setEditStart(toDatetimeLocal(task.start_time));
            setEditEnd(toDatetimeLocal(task.end_time));
        }
    }, [filteredTags, task.start_time, task.end_time]);

    const formatDuration = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    // Convertir en ISO UTC pour l'API
    function fromDatetimeLocal(localStr) {
        if (!localStr) return null;
        // Créer Date en UTC avec "Z"
        return new Date(localStr).toISOString();
    }

    // Convertir ISO en local pour input
    function toDatetimeLocal(iso) {
        if (!iso) return "";
        const d = new Date(iso);
        // Obtenir la Date sans le offset Z
        const tzOffset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - tzOffset * 60000);
        return local.toISOString().slice(0, 16);
    }

    const saveDates = () => {
        const patch = {};
        const s = fromDatetimeLocal(editStart);
        const e = fromDatetimeLocal(editEnd);
        if (s) patch.start_time = s;
        if (e) patch.end_time = e;
        onUpdateTask(task.id, patch);

        // après enregistrement, on libère le verrou sur le UseEffect pour que les valeurs
        // de l'utilisateur puissent repasser dans les inputs
        setIsDateEdited(false);
    };

    const handleStartStop = () => {
        if (!isTimeRunning) {
            onToggleTimer(task.id); // start via Home.startTimer
        } else {
            onToggleTimer(null); // stop via Home.stopTimer
        }
    };

    return (
        <>
            {task.is_completed && (
                <p className="task-completed">Tâche terminée</p>
            )}
            <div className="task-container">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-content">{task.content}</p>
                <p className="task-date">{formattedDate}</p>

                <button onClick={handleStartStop} disabled={isDisabled}>
                    {isTimeRunning ? "Stop" : "Commencer"}
                </button>

                {isTimeRunning && (
                    <p style={{ color: "green" }}>
                        En cours: {formatDuration(elapsed)}
                    </p>
                )}

                <div className="task-dates">
                    <div>
                        Début
                        <input
                            type="datetime-local"
                            value={editStart}
                            onChange={(e) => {
                                setEditStart(e.target.value);
                                setIsDateEdited(true);
                            }}
                        />
                    </div>
                    <div>
                        Fin
                        <input
                            type="datetime-local"
                            value={editEnd}
                            onChange={(e) => {
                                setEditEnd(e.target.value);
                                setIsDateEdited(true);
                            }}
                        />
                    </div>
                    <button type="button" onClick={saveDates}>
                        Enregistrer
                    </button>
                </div>

                <div className="task-is-completed">
                    <input
                        type="checkbox"
                        name="is_completed"
                        id={`is_completed_${task.id}`}
                        checked={task.is_completed}
                        onChange={(e) => {
                            onUpdateTask(task.id, {
                                is_completed: e.target.checked,
                                completed_date: e.target.checked
                                    ? new Date().toISOString()
                                    : null,
                            });
                        }}
                    />
                </div>

                <div className="task-tags">
                    Tags :
                    {task.tags.map((tag) => (
                        <div key={tag.id} className="task-tag">
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

                <button
                    className="task-delete"
                    onClick={() => onDelete(task.id)}
                >
                    Supprimer
                </button>
            </div>
        </>
    );
}

export default Task;
