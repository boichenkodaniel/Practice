const boards= JSON.parse(localStorage.getItem("data")) || []
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
let currentBoard, currentTask, currentBoardIndex=0, currentTheme = localStorage.getItem('theme'), draggedTask = null;

if (currentTheme === "dark"){
        lightModeIcon.style.display="none"
        darkModeIcon.style.display="block"
        currentTheme="dark"
        document.documentElement.setAttribute('theme', 'dark');}

createBtn.addEventListener("click", ()=> {
    addBoardForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
    addBoardTitleInput.focus()
});

const findBoardIndex = (boardId) => {
    const index = boards.findIndex(board => board.id === boardId);
    if (index === -1) {
        alert(`Board with ID "${boardId}" not found!`);
        return
    }else { return index }

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
                <button class="addTaskBtn" id="addTaskBtn" onclick="resetAddTask('${board.id}')"> Add Task</button>
            </div>
            <div class="scheduledTasks" ondragover="handleDragOver(event)" 
                 ondragleave="handleDragLeave(event)" 
                 ondrop="handleDrop(event)">
                <h2>Scheduled tasks</h2>
                ${board.scheduledTasks.map(task => `
                    <article class="task" id="${task.id}" draggable="true" ondragstart="handleDragStart(event)"
                             ondragend="handleDragEnd(event)" ondblclick="fastMove(this)">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.split('T')[0].split('-').reverse().join('.')+ ' ' +task.date.split('T')[1]}</p>
                        <button class="editTaskBtn" onclick="editTask(this)" ><span class="material-symbols-outlined"> edit_square </span></button>
                        <button class="deleteTaskBtn" onclick ="deleteTask(this)"><span class="material-symbols-outlined"> delete </span></button>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")|| ''}
            </div>
            <hr>
            <div class="tasksInProgress" ondragover="handleDragOver(event)" 
                 ondragleave="handleDragLeave(event)" 
                 ondrop="handleDrop(event)">
                <h2>Tasks in progress</h2>
                ${board.progressTasks.map(task => `
                    <article class="task" id="${task.id}" draggable="true" ondragstart="handleDragStart(event)"
                             ondragend="handleDragEnd(event)" ondblclick="fastMove(this)">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.split('T')[0].split('-').reverse().join('.')+ ' ' +task.date.split('T')[1]}</p>
                        <button class="editTaskBtn" onclick="editTask(this)" ><span class="material-symbols-outlined"> edit_square </span></button>
                        <button class="deleteTaskBtn" onclick ="deleteTask(this)"><span class="material-symbols-outlined"> delete </span></button>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")}
            </div>
            <hr>
            <div class="completedTasks" ondragover="handleDragOver(event)" 
                 ondragleave="handleDragLeave(event)" 
                 ondrop="handleDrop(event)">
                <h2>Completed tasks</h2>
                 ${board.completedTasks.map(task => `
                    <article class="task" id="${task.id}" draggable="true" ondragstart="handleDragStart(event)"
                             ondragend="handleDragEnd(event)" ondblclick="fastMove(this)">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.split('T')[0].split('-').reverse().join('.')+ ' ' +task.date.split('T')[1]}</p>
                        <button class="editTaskBtn" onclick="editTask(this)" ><span class="material-symbols-outlined"> edit_square </span></button>
                        <button class="deleteTaskBtn" onclick ="deleteTask(this)"><span class="material-symbols-outlined"> delete </span></button>
                        <p class="taskDescription">${task.description}</p>
                    </article>`).join("")}
            </div>
        </section>`
    });
}

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
        addBoardTitleInput.focus();

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

const deleteTask = (Btn)=>{
    const taskId = Btn.parentElement.id;
    const location = findTaskLocation(taskId);
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

const getToday = ()=>{
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return addTaskDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

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
    
    if (!currentTask) {
    const newTask = {
        ...taskData,
        id: `${taskData.title.toLowerCase().split(" ").join("-")}-${Date.now()}`
    };
    boards[currentBoardIndex].scheduledTasks.push(newTask);
} else {
    const { board, list, taskIndex } = currentTask.originalLocation;
    board[list][taskIndex] = {
        ...taskData,              
        id: currentTask.id        
    };
    currentTask = null;
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
        lightModeIcon.style.display="none"
        darkModeIcon.style.display="block"
        currentTheme="dark"
        document.documentElement.setAttribute('theme', 'dark');
    }else{
        lightModeIcon.style.display="block"
        darkModeIcon.style.display="none"
        currentTheme="light"
        document.documentElement.removeAttribute('theme');
    }
    localStorage.setItem('theme', currentTheme)
})