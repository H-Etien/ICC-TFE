function Tag({ tag, onDelete, needsDeleteButton = false }) {
    // afficher la date sans les millisecondes
    if (!tag) return null;

    const formattedDate = new Date(tag.created_at).toLocaleString("fr-FR");

    return (
        <div className="tag-container">
            <div className="tag">
                <span className="tag-name">{tag.name}</span>
                {needsDeleteButton && (
                    <button
                        className="tag-delete"
                        onClick={() => onDelete(tag.id)}
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </div>
    );
}
export default Tag;
