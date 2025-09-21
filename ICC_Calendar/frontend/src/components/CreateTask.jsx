import React, { useState } from "react";

function toDatetimeLocal(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    // Obtenir la Date sans le offset Z
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16);
}

function CreateTask({
    title,
    setTitle,
    content,
    setContent,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    tags = [],
    selectedTags = [],
    handleTagChange,
    createTask,
}) {
    const [editStart, setEditStart] = useState(toDatetimeLocal(startTime));
    const [editEnd, setEditEnd] = useState(toDatetimeLocal(endTime));

    // nouvel état pour savoir si l'utilisateur édite les dates localement
    const [isDateEdited, setIsDateEdited] = useState(false);

    // Vérifier que la date de fin est après la date de début
    const [dateError, setDateError] = useState("");
    const isEndAfterStart = (startLocal, endLocal) => {
        if (!startLocal || !endLocal) return true;
        const startMs = new Date(startLocal).getTime();
        const endMs = new Date(endLocal).getTime();
        return endMs > startMs;
    };

    const handleChangeStart = (value) => {
        setEditStart(value);
        setIsDateEdited(true);
        // si la fin existe et devient avant le début, on aligne la fin
        if (editEnd && !isEndAfterStart(value, editEnd)) {
            setEditStart(editEnd);
            setDateError(
                "La date de début a été ajustée car elle était antérieure à la fin."
            );
        } else {
            setDateError("");
        }
    };

    const handleChangeEnd = (value) => {
        setEditEnd(value);
        setIsDateEdited(true);
        if (editStart && !isEndAfterStart(editStart, value)) {
            // Empêcher en automatique : on aligne la fin sur le début
            setEditEnd(editStart);
            setDateError(
                "La date de fin ne peut pas être antérieure à la date de début."
            );
        } else {
            setDateError("");
        }
    };
    return (
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
                <div>
                    Début
                    <input
                        type="datetime-local"
                        value={editStart}
                        onChange={(e) => handleChangeStart(e.target.value)}
                    />
                </div>
            </div>
            <hr />
            <div className="tache-fin">
                <div>
                    Fin
                    <input
                        type="datetime-local"
                        value={editEnd}
                        onChange={(e) => handleChangeEnd(e.target.value)}
                    />
                </div>
            </div>
            <div>
                {dateError && (
                    <div style={{ color: "crimson" }}>{dateError}</div>
                )}
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
        </form>
    );
}

export default CreateTask;
