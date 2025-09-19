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
        </form>
    );
}

export default CreateTask;
