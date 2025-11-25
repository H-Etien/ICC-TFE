import React from "react";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";

/**
    Props:
    - tasks: array des tasks (ordre actuel)
    - setTasks: setter pour mettre à jour localement le tableau 
    - onReorder: callback pour envoyer message côté backend; reçoit [{id, order}, ...]
    - renderTaskProps: objet contenant les props à passer à chaque Task (onDelete, onToggleTimer, isTimerDisabled, ...)
 */
function TaskListSortable({
    tasks = [],
    setTasks,
    onReorder,
    renderTaskProps = {},
    layout = "list",
}) {
    const ids = tasks.map((t) => String(t.id));

    // capteur avec un petit délai pour permettre les clics normaux sur les boutons
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150, // combien de ms avant d'activer le drag
                tolerance: 5,
            },
        })
    );

    // pour lister les tâches dans le nouvel ordre après le drag&drop
    const handleDragEnd = (event) => {
        const { active, over } = event;

        const oldIndex = ids.indexOf(active.id);
        const newIndex = ids.indexOf(over.id);
        const newTasks = arrayMove(tasks, oldIndex, newIndex);

        if (typeof setTasks === "function") setTasks(newTasks);

        if (typeof onReorder === "function") {
            const payload = newTasks.map((t, i) => ({ id: t.id, order: i }));
            onReorder(payload);
        }
    };

    const layout_task_strategy =
        layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy;

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={layout_task_strategy}>
                {tasks.map((task) => (
                    <SortableTask
                        key={task.id}
                        task={task}
                        renderTaskProps={renderTaskProps}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
}
export default TaskListSortable;
