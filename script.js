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
addOrEditBoardBtn.addEventListener("click", ()=> {
    addBoardForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
});


let currentBoard = {}
const resetAddBoard = ()=>{
    addBoardForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
    addBoardTitleInput.value ='';
}

cancelBoardBtn.addEventListener("click",resetAddBoard)
cancelTaskBtn.addEventListener("click", ()=>{addTaskForm.classList.toggle("hidden")
    overlay.classList.toggle("hidden")})

const resetAddOrEditTask = (Btn)=>{
    addTaskForm.classList.toggle("hidden")
    overlay.classList.toggle("hidden")
    const boardArrIndex = boards.findIndex((board)=>board.id === Btn.parentElement.parentElement.id)
    
    addTaskForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const newTask = {
            id:`${addTaskTitleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
            title: addTaskTitleInput.value,
            date: addTaskDateInput.value,
            description: addTaskDescriptionInput.value
        };
        boards[boardArrIndex].sheduledTasks.push(newTask);
        localStorage.setItem("data",JSON.stringify(boards));
        addTaskForm.classList.toggle("hidden")
        overlay.classList.toggle("hidden")
        resetAll();
})}    

const resetAll = ()=>{
    mainContainer.innerHTML =''
    boards.forEach(board => {
        mainContainer.innerHTML+=`
         <section class="board" id="${board.id}">
            <div class="boardHeader">
                <p class="boardHeaderTitle">${board.title}</p>
                <button class="addTaskBtn" id="addTaskBtn" onclick="resetAddOrEditTask(this)"> Add Task</button>
            </div>
            <div class="scheduledTasks">
                <h2>Sheduled tasks</h2>
                ${board.sheduledTasks.map(task => `
                    <article class="task" id="${task.id}">
                        <h3>${task.title}</h3>
                        <p class="taskDateTime">${task.date.replace('T',' ')}</p>
                        <button><span class="material-symbols-outlined"> edit_square </span></button>
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
if (boards.length){resetAll();}
addBoardForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const newBoard = {
        id:`${addBoardTitleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: addBoardTitleInput.value,
        sheduledTasks: [],
        progressTasks: [],
        completedTasks: []
    };
    boards.push(newBoard);
    localStorage.setItem("data",JSON.stringify(boards));
    resetAddBoard();
    resetAll();
})


