const leftCaret = document.querySelector("#leftCaret");
const rightCaret = document.querySelector("#rightCaret");
const sizeTag = document.querySelector("#sizeTag");
let size = 3;
const startOrContinueButton = document.querySelector("#startOrContinueButton");
const newGameButton = document.querySelector("#newGameButton");
let gameStarted = false;
const homeButton = document.querySelector("#homeButton");
const restartGameButton = document.querySelector("#restartGameButton");
const undoButton = document.querySelector("#undoButton");
const popUpBg = document.querySelector("#popUpBg");
const popUp = document.querySelector("#popUp");
const popUpYes = document.querySelector("#yes");
const popUpNo = document.querySelector("#no");
let prevBoardConfiguration;
let activeBoard;
let preservedBoards = [];
const board = document.querySelector("#board");
const up = document.querySelector("#up");
const left = document.querySelector("#left");
const right = document.querySelector("#right");
const down = document.querySelector("#down");
let moveInProcess = false;
let cellMotionDistance;

//! Home Page
leftCaret.addEventListener("click", () => {
	size = size == 3 ? 8 : --size;
	sizeTag.innerHTML = `${size}&nbsp;x&nbsp;${size}`;
	preservedBoardOfCurrSizeExists();
});
rightCaret.addEventListener("click", () => {
	size = size == 8 ? 3 : ++size;
	sizeTag.innerHTML = `${size}&nbsp;x&nbsp;${size}`;
	preservedBoardOfCurrSizeExists();
});
startOrContinueButton.addEventListener("click", (e) => {
	gameStarted = true;
	if (startOrContinueButton.innerText == "Start Game") {
		renewActiveBoardArr();
	} else {
		activeBoard = preservedBoards.find((boards) => boards.length === size);
		removeFromPreservedBoards();
	}
	start(startOrContinueButton.innerText);
});
newGameButton.addEventListener("click", (e) => {
	gameStarted = true;
	removeFromPreservedBoards();
	renewActiveBoardArr();
	start(newGameButton.innerText);
});

//! Pop Up
const isPopUpOpen = () => {
	return !popUpBg.classList.contains("hidden");
};
const popUpToggle = () => {
	popUpBg.classList.toggle("hidden");
	popUp.classList.toggle("hidden");
};
popUpYes.addEventListener("click", () => {
	renewActiveBoardArr();
	populateBoard("New Game");
	popUpToggle();
});
popUpNo.addEventListener("click", () => {
	popUpToggle();
});

//! Play Page
homeButton.addEventListener("click", (e) => {
	gameStarted = false;
	homeAndPlayPageSwap();
	preservedBoards.push(activeBoard.map((arr) => [...arr]));
	preservedBoardOfCurrSizeExists();
});
restartGameButton.addEventListener("click", () => {
	popUpToggle();
});
undoButton.addEventListener("click", () => {
	activeBoard = prevBoardConfiguration.map((arr) => [...arr]);
	//* make board again with prevConfig
});
up.addEventListener("click", arrowUpMove);
left.addEventListener("click", arrowLeftMove);
right.addEventListener("click", arrowRightMove);
down.addEventListener("click", arrowDownMove);
document.addEventListener("keydown", (e) => {
	if (!gameStarted || isPopUpOpen() || moveInProcess) return;
	if (e.key === "ArrowUp") arrowUpMove();
	if (e.key === "ArrowLeft") arrowLeftMove();
	if (e.key === "ArrowRight") arrowRightMove();
	if (e.key === "ArrowDown") arrowDownMove();
});

//! Functions
function renewActiveBoardArr() {
	activeBoard = new Array(size).fill().map(() => new Array(size).fill(0));
}
function removeFromPreservedBoards() {
	preservedBoards = preservedBoards.filter((arr) => arr.length !== size);
}
function preservedBoardOfCurrSizeExists() {
	if (preservedBoards.find((matrix) => matrix.length === size)) {
		startOrContinueButton.innerText = "Continue Game";
		newGameButton.classList.remove("hidden");
	} else {
		startOrContinueButton.innerText = "Start Game";
		newGameButton.classList.add("hidden");
	}
}
function homeAndPlayPageSwap() {
	homePage.classList.toggle("hidden");
	playPage.classList.toggle("hidden");
}
function start(start$newGameOrContinueGame) {
	homeAndPlayPageSwap();
	populateBoard(start$newGameOrContinueGame);
}
function populateBoard(start$newGameOrContinueGame) {
	fillBoard();
	if (
		start$newGameOrContinueGame === "Start Game" ||
		start$newGameOrContinueGame === "New Game"
	) {
		randomCellGeneration();
		randomCellGeneration();
	}
}
function fillBoard() {
	const boardDimension = document.querySelector("#board").clientHeight;
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			const cellContainer = document.createElement("div");
			cellContainer.style.height = `calc(${
				(boardDimension - 4 * (size + 1) - 1) / size
				}px)`;
			cellMotionDistance = `${((boardDimension - 4 * (size + 1) - 1) / size) + 4}px`;
			cellContainer.classList.add("cellContainer");
			cellContainer.id = `${i}${j}`;
			//* when UNDO or CONTINUE GAME
			if (activeBoard[i][j] !== 0) {
				const cell = document.createElement("div");
				cell.classList.add("cell");
				cell.innerText = activeBoard[i][j];
				cellContainer.appendChild(cell);
			}
			board.appendChild(cellContainer);
		}
	}
}
function randomCellAppear(i, j, val) {
	const cellContainer = document.getElementById(`${i}${j}`);
	//* animate the appearing of cell, in a function?
	const cell = document.createElement("div");
	cell.classList.add("cell");
	cell.innerText = activeBoard[i][j];
	cellContainer.appendChild(cell);
}
function randomCellGeneration() {
	const val = Math.floor(Math.random() * 2 + 1) * 2;
	do {
		i = Math.floor(Math.random() * size);
		j = Math.floor(Math.random() * size);
	} while (activeBoard[i][j] != 0);
	activeBoard[i][j] = val;
	randomCellAppear(i, j, val);
}
function arrowUpMove() {
	for (let i = 1; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				console.log(1);
				handleCellMotion(i, j, i - 1, j);
			}
		}
	}
}
function arrowLeftMove() {
	console.log(2);
}
function arrowRightMove() {
	console.log(3);
}
function arrowDownMove() {
	console.log(4);
}
function handleCellMotion(currI, currJ, nextI, nextJ) {
	const curr = activeBoard[currI][currJ];
	const next = activeBoard[nextI][nextJ];
	const cell = document.getElementById(`${currI}${currJ}`).firstElementChild;
	if (next === 0) {
		activeBoard[nextI][nextJ] = activeBoard[currI][currJ];
		activeBoard[currI][currJ] = 0;
		cell.style.top = `10px`;
	}
	if (curr === next) {
		activeBoard[nextI][nextJ] = curr * 2;
	}
}
