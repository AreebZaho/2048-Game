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
let anyCellMotionOnBoardPreviously = false;

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
	if (startOrContinueButton.innerText == "Start Game") {
		renewActiveBoardArr();
	} else {
		activeBoard = preservedBoards.find((boards) => boards.length === size);
		removeFromPreservedBoards();
	}
	start(startOrContinueButton.innerText);
});
newGameButton.addEventListener("click", (e) => {
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
	populateBoard("Continue Game ?");
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
		startOrContinueButton.innerText = "Continue Game ?";
		startOrContinueButton.style.fontSize = "1rem";
		newGameButton.classList.remove("hidden");
	} else {
		startOrContinueButton.innerText = "Start Game";
		startOrContinueButton.style.fontSize = "1.2rem";
		newGameButton.classList.add("hidden");
	}
}
function homeAndPlayPageSwap() {
	homePage.classList.toggle("hidden");
	playPage.classList.toggle("hidden");
}
function start(start$newGameOrContinueGame) {
	homeAndPlayPageSwap();
	gameStarted = true;
	populateBoard(start$newGameOrContinueGame);
}
function boardDimension() {
	return board.clientHeight;
}
function cellDimension() {
	return `${(boardDimension() - 8 * (size + 1) - 1) / size}px`;
}
function cellMotionDistance() {
	return `${parseFloat(cellDimension()) + 8}px`;
}
function cellMotionTime() {
	
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
	prevBoardConfiguration = activeBoard.map((arr) => [...arr]);
}
function fillCellContainers() {
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			const cellContainer = document.createElement("div");
			cellContainer.style.height = cellDimension();
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
	setCellPositionAndId(cell, i, j);
	setCellFontSize(cell, i, j);
	return cell;
}
function setCellPositionAndId(cell, i, j) {
	const container = document
		.getElementById(`${i}${j}`)
		.getBoundingClientRect();
	cell.style.top = `${container.top}px`;
	cell.style.left = `${container.left}px`;
	cell.style.width = `${container.width}px`;
	cell.id = `c${i}${j}`;
}
function setCellFontSize(cell, i, j) {
	const val = Math.floor(Math.log10(activeBoard[i][j]));
	const factor = val === 0 || val === 1 ? 1 : val === 2 ? 0.7 : 0.5;
	cell.style.fontSize = `${
		parseInt(cellDimension().match(/^\d+/)[0]) * 0.8 * factor
	}px`;
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
//*move in process !== curr move -> return
function arrowUpMove() {
	anyCellMotionOnBoardPreviously = false;
	//*motion
	let anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let i = 1; i < size; ++i) {
			for (let j = 0; j < size; ++j) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i - 1, j, "Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let i = 1; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(i, j, i - 1, j, "Collision");
			}
		}
	}
	//*motion
	anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let i = 1; i < size; ++i) {
			for (let j = 0; j < size; ++j) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i - 1, j, "Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	if (anyCellMotionOnBoardPreviously) randomCell();
}
function arrowLeftMove() {
	anyCellMotionOnBoardPreviously = false;
	//*motion
	let anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let j = 1; j < size; ++j) {
			for (let i = 0; i < size; ++i) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i, j - 1, "Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let j = 1; j < size; ++j) {
		for (let i = 0; i < size; ++i) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(i, j, i, j - 1, "Collision");
			}
		}
	}
	//*motion
	anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let j = 1; j < size; ++j) {
			for (let i = 0; i < size; ++i) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i, j - 1,"Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	if (anyCellMotionOnBoardPreviously) randomCell();
}
function arrowRightMove() {
	anyCellMotionOnBoardPreviously = false;
	//*motion
	let anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let j = size - 2; j >= 0; --j) {
			for (let i = 0; i < size; ++i) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i, j + 1, "Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let j = size - 2; j >= 0; --j) {
		for (let i = 0; i < size; ++i) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(i, j, i, j + 1, "Collision");
			}
		}
	}
	//*motion
	anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let j = size - 2; j >= 0; --j) {
			for (let i = 0; i < size; ++i) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i, j + 1, "Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	if (anyCellMotionOnBoardPreviously) randomCell();
}
function arrowDownMove() {
	anyCellMotionOnBoardPreviously = false;
	//*motion
	let anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let i = size - 2; i >= 0; --i) {
			for (let j = 0; j < size; ++j) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i + 1, j, "Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let i = size - 2; i >= 0; --i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(i, j, i + 1, j, "Collision");
			}
		}
	}
	//*motion
	anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let i = size - 2; i >= 0; --i) {
			for (let j = 0; j < size; ++j) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleCellMove(i, j, i + 1, j, "Motion");
				}
			}
		}
	} while (anyCellMotionOnBoard);
	if (anyCellMotionOnBoardPreviously) randomCell();
}
function handleCellMove(currI, currJ, nextI, nextJ, moveType) {
	const currCell = document.getElementById(`c${currI}${currJ}`);
	const nextCell = document.getElementById(`c${nextI}${nextJ}`);
	if (activeBoard[nextI][nextJ] === 0 && moveType === "Motion") {
		activeBoard[nextI][nextJ] = activeBoard[currI][currJ];
		activeBoard[currI][currJ] = 0;
		currCell.style.transform = cellTranslateMotion(currI, currJ, nextI, nextJ);
		setCellPositionAndId(currCell, nextI, nextJ);
		currCell.style.removeProperty("transform");
		return anyCellMotionOnBoardPreviously = true;
	}
	if (activeBoard[currI][currJ] === activeBoard[nextI][nextJ] && moveType === "Collision") {
		activeBoard[nextI][nextJ] *= 2;
		activeBoard[currI][currJ] = 0;
		nextCell.innerText = activeBoard[nextI][nextJ];
		setCellFontSize(nextCell, nextI, nextJ);
		board.removeChild(currCell);
		return anyCellMotionOnBoardPreviously = true;
	}
	return false;
}
function cellTranslateMotion(currI, currJ, nextI, nextJ) {
	if (currI > nextI) return `translateY(-${cellMotionDistance()})`;
	else if (currI < nextI) return `translateY(${cellMotionDistance()})`;
	else if (currJ < nextJ) return `translateX(${cellMotionDistance()})`;
	else return `translateX(-${cellMotionDistance()})`;
}
