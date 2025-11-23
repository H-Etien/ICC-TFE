import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Task from "./Task";

/**
    Conteneur sortable pour Task.
    renderTaskProps: objet passé depuis TaskListSortable pour déléguer handlers/flags
 */
function SortableTask({ task, renderTaskProps = {} }) {
    const isDragDisabled = renderTaskProps.isTimerDisabled(task.id);

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id: String(task.id),
            disabled: isDragDisabled,
        });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        // affiche pointeur, la main 🖐️ qui montre qu'une Task est draggable
        cursor: isDragDisabled ? "default" : "grab",
    };

    // garde les mêmes attributs de la Task
    const taskProps = {
        task,
        onDelete: renderTaskProps.onDelete,
        availableTags: renderTaskProps.availableTags,
        onAddTag: renderTaskProps.onAddTag,
        onRemoveTag: renderTaskProps.onRemoveTag,
        onUpdateTask: renderTaskProps.onUpdateTask,
        onUpdateTimeSpent: renderTaskProps.onUpdateTimeSpent,
        isTimeRunning: renderTaskProps.isTimeRunning(task.id),
        elapsed: renderTaskProps.elapsed || 0,
        isTimerDisabled: renderTaskProps.isTimerDisabled(task.id),
        onToggleTimer: renderTaskProps.onToggleTimer
            ? () => renderTaskProps.onToggleTimer(task.id)
            : undefined,
    };

    return (
        // appliquer attributes/listeners sur le conteneur entier pour rendre toute la task draggable
        <div
            ref={setNodeRef}
            style={style}
            className="sortable-task"
            {...(isDragDisabled ? {} : { ...attributes, ...listeners })}
        >
            {/* icône de poignée pour montrer une Task draggable
            <span>≡</span> */}

            <Task {...taskProps} />
        </div>
    );
}

export default SortableTask;
