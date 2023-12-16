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
function boardDimension() {
	return board.clientHeight;
}
function cellDimension() {
	return `${(boardDimension() - 4 * (size + 1) - 1) / size}px`;
}
function valueLengthFactor(i, j) {
	const val = Math.floor(Math.log10(activeBoard[i][j]));
	return (val === 0 || val === 1) ? 1 : (val === 2) ? 0.8 : 0.5;
}
function cellMotionDistance() {
	return `${parseFloat(cellDimension()) + 4}px`;
}
function cellMotionTime() {
	return size;
}
function populateBoard(start$newGameOrContinueGame) {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
	fillCellContainers();
	fillCells();
	if (
		start$newGameOrContinueGame === "Start Game" ||
		start$newGameOrContinueGame === "New Game"
	) {
		randomCell();
		randomCell();
	}
}
function fillCellContainers() {
	const cellDimension = `${(boardDimension() - 4 * (size + 1) - 1) / size}px`;
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			const cellContainer = document.createElement("div");
			cellContainer.style.height = cellDimension;
			cellContainer.classList.add("cellContainer");
			cellContainer.id = `${i}${j}`;
			board.appendChild(cellContainer);
		}
	}
}
function fillCells() {
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				board.appendChild(createCell(i, j));
			}
		}
	}
}
function createCell(i, j) {
	const cell = document.createElement("div");
	cell.classList.add("cell");
	cell.style.height = cellDimension();
	cell.innerText = activeBoard[i][j];
	cell.style.fontSize = `${
		parseInt(cellDimension().match(/^\d+/)[0]) * 0.8 * valueLengthFactor(i, j)
	}px`;
	cell.id = `c${i}${j}`;
	const box = document.getElementById(`${i}${j}`).getBoundingClientRect();
	cell.style.top = `${box.top}px`;
	cell.style.left = `${box.left}px`;
	cell.style.width = `${box.width}px`;
	cell.style.height = `${box.height}px`;
	return cell;
}
function randomCell() {
	do {
		i = Math.floor(Math.random() * size);
		j = Math.floor(Math.random() * size);
	} while (activeBoard[i][j] != 0);
	const val = Math.floor(Math.random() * 2 + 1) * 2;
	activeBoard[i][j] = val;
	randomCellAppear(i, j);
}
function randomCellAppear(i, j) {
	const cell = createCell(i, j);
	//* appearing cell animation
	board.appendChild(cell);
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
