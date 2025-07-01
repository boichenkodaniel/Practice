const boards= JSON.parse(localStorage.getItem("data")) || []
const addOrEditBoardBtn = document.getElementById('createBtn')
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
let currentBoard, currentTask;

addOrEditBoardBtn.addEventListener("click", ()=> {
    addBoardForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
});


const findTaskLocation = (taskId) => {
    for (const board of boards) {
        const lists = ['sheduledTasks', 'progressTasks', 'completedTasks'];
        for (const list of lists) {
            const taskIndex = board[list].findIndex(task => task.id === taskId);
            if (taskIndex >= 0) {
                return { board, list, taskIndex };
            }
        }
    }
    return null;
};

const resetAddTask = ()=>{
    addTaskForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
    addTaskTitleInput.value='';
    addTaskDateInput.value='';
    addTaskDescriptionInput.value=''
    addTaskHeader.innerText = "Add Task";
    submitTaskBtn.innerText = "Add Task"
}

const deleteTask = (Btn)=>{
    const taskId = Btn.parentElement.id;
    const location = findTaskLocation(taskId);
    console.log(location);
    if (location) {
        location.board[location.list].splice(location.taskIndex, 1);
        localStorage.setItem("data", JSON.stringify(boards));
        resetAll();
    };
}

const editTask = (Btn)=>{
    const taskId = Btn.parentElement.id;
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

addTaskForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const taskData = {
        title: addTaskTitleInput.value,
        date: addTaskDateInput.value,
        description: addTaskDescriptionInput.value
    };
    
    if (!currentTask) {
    const newTask = {
        ...taskData,
        id: `${taskData.title.toLowerCase().split(" ").join("-")}-${Date.now()}`
    };
    boards[currentBoard].sheduledTasks.push(newTask);
} else {
    const { board, list, taskIndex } = currentTask.originalLocation;
    board[list][taskIndex] = {
        ...taskData,              
        id: currentTask.id        
    };
    currentTask = null;
}
    localStorage.setItem("data", JSON.stringify(boards));
    resetAddTask();
    resetAll();
})

const findBoardIndex = (boardId) => {
    return boards.findIndex(board => board.id === boardId);
};

const resetAddBoard = () => {
    addBoardForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
    addBoardTitleInput.value = '';
    addBoardHeader.innerText = "Add Board";
    submitBoardBtn.innerText = "Add Board"
    currentBoard = null; 

};
const resetAll = ()=>{
    mainContainer.innerHTML =''
    boards.forEach(board => {
        mainContainer.innerHTML+=`
         <section class="board" id="${board.id}">
            <div class="boardHeader">
                <p class="boardHeaderTitle">${board.title}</p>
                <button class="editBoardBtn" onclick ="editBoard(this)"><span class="material-symbols-outlined"> edit </span></button>
                <button class="deleteBoardBtn" onclick ="deleteBoard(this)"><span class="material-symbols-outlined"> delete </span></button>
                <button class="addTaskBtn" id="addTaskBtn" onclick="resetAddTask()"> Add Task</button>
            </div>
            <div class="scheduledTasks">
                <h2>Sheduled tasks</h2>
                ${board.sheduledTasks.map(task => `
                    <article class="task" id="${task.id}">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.split('T')[0].split('-').reverse().join('.')+ ' ' +task.date.split('T')[1]}</p>
                        <button class="editTaskBtn" onclick="editTask(this)" ><span class="material-symbols-outlined"> edit_square </span></button>
                        <button class="deleteTaskBtn" onclick ="deleteTask(this)"><span class="material-symbols-outlined"> delete </span></button>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")|| ''}
            </div>
            <hr>
            <div class="tasksInProgress">
                <h2>Tasks in progress</h2>
                ${board.progressTasks.map(task => `
                    <article class="task" id="${task.id}">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date}</p>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")}
            </div>
            <hr>
            <div class="completedTasks">
                <h2>Completed tasks</h2>
                 ${board.completedTasks.map(task => `
                    <article class="task" id="${task.id}">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date}</p>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")}
            </div>
        </section>`
    });
}
addBoardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const boardData = {
        title: addBoardTitleInput.value,
        sheduledTasks: [],
        progressTasks: [],
        completedTasks: []
    };

    if (!currentBoard) {
        const newBoard = {
            ...boardData,
            id: `${boardData.title.toLowerCase().split(" ").join("-")}-${Date.now()}`
        };
        boards.push(newBoard);
    } else {
        const boardIndex = findBoardIndex(currentBoard.id);
        if (boardIndex >= 0) {
            boardData.sheduledTasks = boards[boardIndex].sheduledTasks;
            boardData.progressTasks = boards[boardIndex].progressTasks;
            boardData.completedTasks = boards[boardIndex].completedTasks;
            
            boards[boardIndex] = {
                ...boards[boardIndex], 
                ...boardData,         
                id: currentBoard.id   
            };
        }
        currentBoard = null; 
    }

    localStorage.setItem("data", JSON.stringify(boards));
    resetAddBoard();
    resetAll();
});

const editBoard = (btn) => {
    const boardId = btn.parentElement.parentElement.id;
    const boardIndex = findBoardIndex(boardId);
    
    if (boardIndex >= 0) {
        currentBoard = {
            ...boards[boardIndex],
            originalIndex: boardIndex 
        };

        addBoardForm.classList.toggle("hidden");
        overlay.classList.toggle("hidden");

        addBoardTitleInput.value = currentBoard.title;
        addBoardHeader.innerText = "Edit Board";
        submitBoardBtn.innerText = "Edit Board"
    }
};

const deleteBoard = (btn) => {
    const boardId = btn.parentElement.parentElement.id;
    const boardIndex = findBoardIndex(boardId);
    
    if (boardIndex >= 0) {
        boards.splice(boardIndex, 1);
        localStorage.setItem("data", JSON.stringify(boards));
        resetAll();
    }
};

if (boards.length){resetAll();}

cancelBoardBtn.addEventListener("click",resetAddBoard)

cancelTaskBtn.addEventListener("click", ()=>resetAddTask())
