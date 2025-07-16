import { boards, resetAll} from "./main.js"
const addBoardForm = document.getElementById('addBoardForm')
const overlay = document.getElementById('overlay')
const addBoardTitleInput = document.getElementById('AddBoardTitle-input')
const addBoardHeader = document.getElementById("addBoardHeader")
const submitBoardBtn = document.getElementById("submitBoardBtn")
let currentBoard = null;

const getCurrentBoard =()=>{return currentBoard}
const setCurrentBoard =(board)=>{currentBoard = board}
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

const editBoard = (boardId) => {
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

const deleteBoard = (boardId) => {
    const boardIndex = findBoardIndex(boardId);
    if (boardIndex >= 0) {
        boards.splice(boardIndex, 1);
        localStorage.setItem("data", JSON.stringify(boards));
        resetAll();
    }
};

export {findBoardIndex,resetAddBoard,editBoard,deleteBoard, setCurrentBoard, getCurrentBoard};