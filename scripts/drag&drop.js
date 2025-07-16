import { findBoardIndex } from "./boards.js";
import { boards } from "./main.js";

let draggedTask;
const handleDragStart = (e) => {
    draggedTask = e.target;
};

const handleDragEnd = (e) => {
    draggedTask = null;
};

const handleDragOver = (e) => {
    e.preventDefault();
    const targetList = e.target.closest('.scheduledTasks, .tasksInProgress, .completedTasks');
    if (targetList) {
        targetList.style.backgroundColor = '#3F92D2';
    }
};

const handleDragLeave = (e) => {
    const targetList = e.target.closest('.scheduledTasks, .tasksInProgress, .completedTasks');
    if (targetList) {
        targetList.style.backgroundColor = '';
    }
};

const handleDrop = (e) => {
    e.preventDefault();
    const targetList = e.target.closest('.scheduledTasks, .tasksInProgress, .completedTasks');
    if (!targetList || !draggedTask) return;

    targetList.style.backgroundColor = '';

    const taskId =  draggedTask.id;
    const sourceList = draggedTask.parentElement;
    const targetListType = targetList.className;
    const boardIndex = findBoardIndex(targetList.closest('.board').id);

    updateTaskPosition(taskId, boardIndex, sourceList.className, targetListType);

    targetList.appendChild(draggedTask);
};

const updateTaskPosition = (taskId, boardIndex, sourceListType, targetListType) => {
    if (boardIndex === -1) return;

    const getListName = (className) => {
        if (className.includes('scheduledTasks')) return 'scheduledTasks';
        if (className.includes('tasksInProgress')) return 'progressTasks';
        if (className.includes('completedTasks')) return 'completedTasks';
        return null;
    };

    const sourceListName = getListName(sourceListType);
    const targetListName = getListName(targetListType);
    if (!sourceListName || !targetListName) return;

    const taskIndex = boards[boardIndex][sourceListName].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = boards[boardIndex][sourceListName].splice(taskIndex, 1);
    boards[boardIndex][targetListName].push(task[0]);
    
    localStorage.setItem("data", JSON.stringify(boards));
};

export {
    handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, updateTaskPosition,draggedTask };