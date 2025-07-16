import {findBoardIndex,resetAddBoard, editBoard, deleteBoard, setCurrentBoard,getCurrentBoard} from './boards.js'
import {findTaskLocation,getToday,editTask,deleteTask,resetAddTask,setCurrentTask,getCurrentTask, getCurrentBoardIndex} from "./tasks.js"
import { handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop} from './drag&drop.js';
const boards = JSON.parse(localStorage.getItem("data")) || []
const createBtn = document.getElementById('createBtn')
const addBoardForm = document.getElementById('addBoardForm')
const overlay = document.getElementById('overlay')
const cancelBoardBtn = document.getElementById('cancelBoardBtn')
const addBoardTitleInput = document.getElementById('AddBoardTitle-input')
const mainContainer = document.getElementById("main")
const addTaskForm = document.getElementById("addTaskForm")
const addTaskTitleInput = document.getElementById("addTaskTitle-input")
const addTaskDateInput = document.getElementById("addTaskDate-input")
const addTaskDescriptionInput = document.getElementById("addTaskDescription-input")
const cancelTaskBtn = document.getElementById("cancelTaskBtn")
const addTaskHeader = document.getElementById("addTaskHeader")
const submitTaskBtn = document.getElementById("submitTaskBtn")
const addBoardHeader = document.getElementById("addBoardHeader")
const submitBoardBtn = document.getElementById("submitBoardBtn")
const switchModeBtn = document.getElementById("switchModeBtn")
const darkModeIcon = document.getElementById("darkModeIcon")
const lightModeIcon = document.getElementById("lightModeIcon")



let currentTheme = localStorage.getItem('theme');


const SetButtonEventListeners =()=>{
    document.querySelectorAll('.editBoardBtn').forEach(btn => {btn.addEventListener('click',()=>editBoard(btn.closest('.board').id));})
    document.querySelectorAll('.deleteBoardBtn').forEach(btn => {btn.addEventListener('click', ()=>deleteBoard(btn.closest('.board').id));})
    document.querySelectorAll('.addTaskBtn').forEach(btn => {btn.addEventListener('click',()=>resetAddTask(btn.closest('.board').id));})
    document.querySelectorAll('.editTaskBtn').forEach(btn => {btn.addEventListener('click',()=>editTask(btn.closest('.task').id));})
    document.querySelectorAll('.deleteTaskBtn').forEach(btn => {btn.addEventListener('click', ()=>deleteTask(btn.closest('.task').id));})
}

if (currentTheme === "dark"){
        lightModeIcon.style.opacity="0"
        darkModeIcon.style.opacity="1"
        currentTheme="dark"
        document.body.classList.toggle('dark-theme');
}
const resetAll = ()=>{
    mainContainer.innerHTML =''
    boards.forEach(board => {
        mainContainer.innerHTML+=`
         <section class="board" id="${board.id}">
            <div class="boardHeader">
                <p class="boardHeaderTitle">${board.title}</p>
                <button class="editBoardBtn" ><span class="material-symbols-outlined"> edit </span></button>
                <button class="deleteBoardBtn"><span class="material-symbols-outlined"> delete </span></button>
                <button class="addTaskBtn" id="addTaskBtn"> Add Task</button>
            </div>
            <div class="scheduledTasks">
                <h2>Scheduled tasks</h2>
                ${board.scheduledTasks.map(task => `
                    <article class="task" id="${task.id}" draggable="true"">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.split('T')[0].split('-').reverse().join('.')+ ' ' +task.date.split('T')[1]}</p>
                        <button class="editTaskBtn" ><span class="material-symbols-outlined"> edit_square </span></button>
                        <button class="deleteTaskBtn"><span class="material-symbols-outlined"> delete </span></button>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")|| ''}
            </div>
            <hr>
            <div class="tasksInProgress">
                <h2>Tasks in progress</h2>
                ${board.progressTasks.map(task => `
                    <article class="task" id="${task.id}" draggable="true" ">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.split('T')[0].split('-').reverse().join('.')+ ' ' +task.date.split('T')[1]}</p>
                        <button class="editTaskBtn"><span class="material-symbols-outlined"> edit_square </span></button>
                        <button class="deleteTaskBtn"><span class="material-symbols-outlined"> delete </span></button>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")}
            </div>
            <hr>
            <div class="completedTasks">
                <h2>Completed tasks</h2>
                 ${board.completedTasks.map(task => `
                    <article class="task" id="${task.id}" draggable="true" ">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.split('T')[0].split('-').reverse().join('.')+ ' ' +task.date.split('T')[1]}</p>
                        <button class="editTaskBtn"><span class="material-symbols-outlined"> edit_square </span></button>
                        <button class="deleteTaskBtn"><span class="material-symbols-outlined"> delete </span></button>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")}
            </div>
        </section>`
    });
    document.querySelectorAll('.scheduledTasks, .tasksInProgress, .completedTasks').forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragleave', handleDragLeave);
        list.addEventListener('drop', handleDrop);
    });
    document.querySelectorAll('.task').forEach(task => {
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
        task.addEventListener('dblclick', () => fastMove(task));
    });
    SetButtonEventListeners();
}

createBtn.addEventListener("click", ()=> {
    addBoardForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
    addBoardTitleInput.focus()
});

addBoardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!addBoardTitleInput.value.trim()){
        alert("Board name cannot be empty!")
        addBoardTitleInput.focus();
        return;
    }
    const boardData = {
        title: addBoardTitleInput.value,
        scheduledTasks: [],
        progressTasks: [],
        completedTasks: []
    };
    const currentBoard =getCurrentBoard();
    if (!currentBoard) {
        const newBoard = {
            ...boardData,
            id: `${boardData.title.toLowerCase().split(" ").join("-")}-${Date.now()}`
        };
        boards.push(newBoard);
    } else {
        const boardIndex = findBoardIndex(currentBoard.id);
        if (boardIndex >= 0) {
            boardData.scheduledTasks = boards[boardIndex].scheduledTasks;
            boardData.progressTasks = boards[boardIndex].progressTasks;
            boardData.completedTasks = boards[boardIndex].completedTasks;
            
            boards[boardIndex] = {
                ...boards[boardIndex], 
                ...boardData,         
                id: currentBoard.id   
            };
        }
        setCurrentBoard(null); 
    }

    localStorage.setItem("data", JSON.stringify(boards));
    resetAddBoard();
    resetAll();
});

addTaskForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!addTaskTitleInput.value.trim()){
        alert("Task name cannot be empty!")
        addTaskTitleInput.focus();
        return;
    }
    
    if (!addTaskDateInput.value){
        addTaskDateInput.value = getToday();
    }
    const taskData = {
        title: addTaskTitleInput.value,
        date: addTaskDateInput.value,
        description: addTaskDescriptionInput.value
    };
    const currentTask = getCurrentTask()
    if (!currentTask) {
    const newTask = {
        ...taskData,
        id: `${taskData.title.toLowerCase().split(" ").join("-")}-${Date.now()}`
    };
    boards[getCurrentBoardIndex()].scheduledTasks.push(newTask);
} else {
    const { board, list, taskIndex } = currentTask.originalLocation;
    board[list][taskIndex] = {
        ...taskData,              
        id: currentTask.id        
    };
    setCurrentTask(null);
}
    localStorage.setItem("data", JSON.stringify(boards));
    addTaskForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
    resetAll();
})


if (boards.length){resetAll();}

cancelBoardBtn.addEventListener("click",resetAddBoard)

cancelTaskBtn.addEventListener("click",()=>{
    addTaskForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
})
const fastMove = (e) =>{
    const taskLocation = findTaskLocation(e.id)
    if (!taskLocation){return;}
    const { board, list, taskIndex } = taskLocation;
    const task = board[list][taskIndex];

    let nextList;
    if (list === "scheduledTasks") {
        nextList = "progressTasks";
    } else if (list === "progressTasks") {
        nextList = "completedTasks";
    }
    if (!nextList) return;

    board[list].splice(taskLocation.taskIndex, 1);
    board[nextList].push(task);
    localStorage.setItem("data", JSON.stringify(boards));
    resetAll();
}

switchModeBtn.addEventListener("click",()=>{
    if (currentTheme==="light"){
        lightModeIcon.style.opacity="0"
        darkModeIcon.style.opacity="1"
        currentTheme="dark"
        document.body.classList.toggle('dark-theme');
    }else{
        lightModeIcon.style.opacity="1"
        darkModeIcon.style.opacity="0"
        currentTheme="light"
        document.body.classList.toggle('dark-theme');
    }
    localStorage.setItem('theme', currentTheme)
})

export {boards, resetAll}

