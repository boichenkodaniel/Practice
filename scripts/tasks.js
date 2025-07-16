import { boards, resetAll } from "./main.js"
import { findBoardIndex } from "./boards.js"
const overlay = document.getElementById('overlay')
const addTaskForm = document.getElementById("addTaskForm")
const addTaskTitleInput = document.getElementById("addTaskTitle-input")
const addTaskDateInput = document.getElementById("addTaskDate-input")
const addTaskDescriptionInput = document.getElementById("addTaskDescription-input")
const addTaskHeader = document.getElementById("addTaskHeader")
const submitTaskBtn = document.getElementById("submitTaskBtn")
let currentBoardIndex=0;
let currentTask=null;
const getCurrentTask =()=>{return currentTask}
const setCurrentTask =(task)=>{currentTask = task}
const getCurrentBoardIndex =()=>{return currentBoardIndex}

const findTaskLocation = (taskId) => {
    for (const board of boards) {
        const lists = ['scheduledTasks', 'progressTasks', 'completedTasks'];
        for (const list of lists) {
            const taskIndex = board[list].findIndex(task => task.id === taskId);
            if (taskIndex >= 0) {  
                return { board, list, taskIndex };
            }
        }
    }
    alert(`Task with ID "${taskId}" not found!`)
    return null;
};
         
const resetAddTask = (board)=>{
    currentBoardIndex = findBoardIndex(board)
    addTaskForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
    addTaskTitleInput.focus(    )
    addTaskTitleInput.value='';
    addTaskDateInput.value='';
    addTaskDescriptionInput.value=''
    addTaskHeader.innerText = "Add Task";
    submitTaskBtn.innerText = "Add Task"
}

const deleteTask = (taskId)=>{
    const location = findTaskLocation(taskId);
    if (location) {
        location.board[location.list].splice(location.taskIndex, 1);
        localStorage.setItem("data", JSON.stringify(boards));
        resetAll();
    };
}

const editTask = (taskId)=>{
    const location = findTaskLocation(taskId);
    
    if (location) {
        currentTask = {
            ...location.board[location.list][location.taskIndex],
            originalLocation: location 
        };

        addTaskForm.classList.toggle("hidden");
        overlay.classList.toggle("hidden");

        addTaskTitleInput.value = currentTask.title;
        addTaskDateInput.value = currentTask.date;
        addTaskDescriptionInput.value = currentTask.description;
        addTaskHeader.innerText = "Edit Task";
        submitTaskBtn.innerText = "Edit Task"
    }
}

const getToday = ()=>{
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return addTaskDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

export {findTaskLocation,getToday,editTask,deleteTask,resetAddTask,setCurrentTask,getCurrentTask,getCurrentBoardIndex}