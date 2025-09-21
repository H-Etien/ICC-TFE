import { useState, useEffect } from "react";

function useTimer(updateTaskTime) {
    const [activeTimerTaskId, setActiveTimerTaskId] = useState(null);
    const [activeStartTime, setActiveStartTime] = useState(null);
    const [timerElapsed, setTimerElapsed] = useState(0);

    useEffect(() => {
        let interval;
        if (activeTimerTaskId && activeStartTime) {
            interval = setInterval(() => {
                const elapsed = Math.floor(
                    (Date.now() - new Date(activeStartTime).getTime()) / 1000
                );
                setTimerElapsed(elapsed);
            }, 1000);
        } else {
            setTimerElapsed(0);
        }
        return () => clearInterval(interval);
    }, [activeTimerTaskId, activeStartTime]);

    const startTimer = (taskId) => {
        // Si un autre timer est actif, on l'arrête d'abord
        setActiveTimerTaskId(taskId);

        setActiveStartTime(new Date().toISOString());
        setTimerElapsed(0);
    };

    const stopTimer = () => {
        const now = Date.now();
        const startMs = new Date(activeStartTime).getTime();
        const secondsElapsed = Math.floor((now - startMs) / 1000);

        const stoppedTaskId = activeTimerTaskId;
        setActiveTimerTaskId(null);
        setActiveStartTime(null);
        setTimerElapsed(0);

        return { taskId: stoppedTaskId, secondsElapsed };
    };

    const await_updateTaskTime = async (taskId, seconds) => {
        try {
            await updateTaskTime(taskId, seconds);
        } catch (e) {
            console.error("useTimer onPersist error:", e);
        }
    };

    const onToggleTimer = async (taskId) => {
        // si un autre timer est actif, on le stoppe et on persiste son temps
        if (activeTimerTaskId && activeTimerTaskId !== taskId) {
            const { taskId: stoppedTaskId, secondsElapsed } = stopTimer();
            if (stoppedTaskId)
                await await_updateTaskTime(stoppedTaskId, secondsElapsed);
            // démarrer le nouveau
            startTimer(taskId);
            return;
        }

        // Pour le toggle button : si le timer actif est celui de la tâche, on l'arrête
        if (activeTimerTaskId === taskId) {
            const { taskId: stoppedTaskId, seconds } = stopTimer();
            if (stoppedTaskId) await_updateTaskTime(stoppedTaskId, seconds);
            return;
        }

        // Recommencer le timer pour cette tâche
        startTimer(taskId);
    };

    const isTimerDisabled = (taskId) =>
        activeTimerTaskId !== null && activeTimerTaskId !== taskId;

    return {
        activeTimerTaskId,
        timerElapsed,
        // startTimer,
        // stopTimer,
        onToggleTimer,
        isTimerDisabled,
    };
}

export default useTimer;
