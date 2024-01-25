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
let auxiPrevBoardConfiguration;
let preservedBoards = [];
let activeBoard;
const preservedScores = new Array(6);
const preservedBestScores = new Array(6);
const board = document.querySelector("#board");
let moveInProcess = false;
let anyCellMotionOnBoardPreviously = false;
let prevScore = 0;
let prevBestScore = 0;
const score = document.querySelector("#score");
const best = document.querySelector("#best");

//! Home Page
leftCaret.addEventListener("click", () => {
	size = size == 3 ? 8 : --size;
	sizeTag.innerHTML = `${size}&nbsp;x&nbsp;${size}`;
	preservedBoardOfCurrSizeExistsAndUpdateBoardPadding();
});
rightCaret.addEventListener("click", () => {
	size = size == 8 ? 3 : ++size;
	sizeTag.innerHTML = `${size}&nbsp;x&nbsp;${size}`;
	preservedBoardOfCurrSizeExistsAndUpdateBoardPadding();
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
	preservedScores[size - 3] = prevScore;
	preservedBestScores[size - 3] = prevBestScore;
	gameStarted = false;
	homeAndPlayPageSwap();
	preservedBoards.push(activeBoard.map((arr) => [...arr]));
	preservedBoardOfCurrSizeExistsAndUpdateBoardPadding();
});
restartGameButton.addEventListener("click", () => {
	popUpToggle();
});
undoButton.addEventListener("click", () => {
	activeBoard = prevBoardConfiguration.map((arr) => [...arr]);
	//* both scores updates in populateBoard() based on start/new/continue so update here after func() call for correct values
	score.innerHTML = `SCORE<br>${prevScore}`;
	best.innerHTML = `BEST<br>${prevBestScore}`;
	populateBoard("Continue Game ?");
});
function cannotPerformMove() {
	return !gameStarted || isPopUpOpen() || moveInProcess;
}
let startX, startY, endX, endY;
board.addEventListener("touchstart", handleInput);
board.addEventListener("touchmove", handleInput);
board.addEventListener("touchend", handleInput);
document.addEventListener("keydown", handleInput);
function handleInput(e) {
	e.preventDefault();
	if (cannotPerformMove()) return;
	switch (e.type) {
		case "touchstart":
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			break;
		case "touchmove":
			endX = e.touches[0].clientX;
			endY = e.touches[0].clientY;
			break;
		case "touchend":
			const deltaX = endX - startX;
			const deltaY = endY - startY;
			const threshold = 50;
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX > threshold) {
					handleMove("ArrowRight");
				} else if (deltaX < -threshold) {
					handleMove("ArrowLeft");
				}
			} else {
				if (deltaY > threshold) {
					handleMove("ArrowDown");
				} else if (deltaY < -threshold) {
					handleMove("ArrowUp");
				}
			}
			break;
		case "keydown":
			handleMove(e.key);
	}
}

//! Functions
function renewActiveBoardArr() {
	activeBoard = new Array(size).fill().map(() => new Array(size).fill(0));
}
function removeFromPreservedBoards() {
	preservedBoards = preservedBoards.filter((arr) => arr.length !== size);
}
function preservedBoardOfCurrSizeExistsAndUpdateBoardPadding() {
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
	//* scoreCards updation(s)
	if (
		start$newGameOrContinueGame === "Start Game" ||
		start$newGameOrContinueGame === "New Game"
	) {
		prevScore = 0;
		prevBestScore = preservedBestScores[size - 3] || 0;
		score.innerHTML = `SCORE<br>0`;
	} else {
		prevScore = preservedScores[size - 3];
		prevBestScore = preservedBestScores[size - 3]; //* won't be 0 since game CONTINUED
		score.innerHTML = `SCORE<br>${preservedScores[size - 3]}`; //* continueGame always has preserved score
	}
	best.innerHTML = `BEST<br>${preservedBestScores[size - 3] || 0}`; //* if new size board for first time -> best = 0
	gameStarted = true;
	populateBoard(start$newGameOrContinueGame);
}
function boardDimension() {
	return board.clientHeight;
}
function cellMargin() {
	return size < 7 ? 4 : 3;
}
function cellDimension() {
	return `${(boardDimension() - cellMargin() * 2 * size - 13) / size}px`;
}
function fillCellContainers() {
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			const cellContainer = document.createElement("div");
			cellContainer.id = `${i}${j}`;
			cellContainer.classList.add("cellContainer");
			cellContainer.style.height = `${(boardDimension() * 0.9) / size}px`;
			// cellContainer.style.margin = `${cellMargin()}px`;
			cellContainer.style.margin = `${
				(boardDimension() - boardDimension() * 0.9) / (size + 2) / 2
			}px`;
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
function cellMotionDistance() {
	return `${parseFloat(cellDimension()) + 8}px`;
}
function cellMotionTime() {}
function randomCellAppear(i, j) {
	const cell = createCell(i, j);
	//* appearing cell animation
	board.appendChild(cell);
}
function randomCell() {
	do {
		i = Math.floor(Math.random() * size);
		j = Math.floor(Math.random() * size);
	} while (activeBoard[i][j] != 0);
	const val = Math.floor(Math.random() * 10);
	activeBoard[i][j] = val == 9 ? 4 : 2;
	randomCellAppear(i, j);
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
function createCell(i, j) {
	const cell = document.createElement("div");
	const val = activeBoard[i][j];
	cell.classList.add("cell");
	cell.style.height = cellDimension();
	cell.style.margin = `${cellMargin()}px`;
	cell.innerText = val;
	setCellPositionAndId(cell, i, j);
	setCellColorAndFontSize(cell, val);
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
function setCellColorAndFontSize(cell, val) {
	cell.classList.add(`tile${val}`);
	const log10 = Math.floor(Math.log10(val));
	const factor =
		log10 === 0
			? 0.8
			: log10 === 1
			? 0.72
			: log10 === 2
			? 0.48
			: log10 === 3
			? 0.36
			: log10 === 4
			? 0.32
			: 0.28;
	cell.style.fontSize = `${
		parseInt(cellDimension().match(/^\d+/)[0]) * factor
	}px`;
}
function updateScores(val) {
	const currScore = parseInt(score.innerHTML.substring(9));
	const currBestScore = parseInt(best.innerHTML.substring(8));
	//*animation + updation
	score.innerHTML = `SCORE<br>${currScore + val}`;
	best.innerHTML = `BEST<br>${Math.max(currScore + val, currBestScore)}`;
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i - 1,
						j,
						"Motion"
					);
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let i = 1; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(
					i,
					j,
					i - 1,
					j,
					"Collision"
				);
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i - 1,
						j,
						"Motion"
					);
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i,
						j - 1,
						"Motion"
					);
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let j = 1; j < size; ++j) {
		for (let i = 0; i < size; ++i) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(
					i,
					j,
					i,
					j - 1,
					"Collision"
				);
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i,
						j - 1,
						"Motion"
					);
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i,
						j + 1,
						"Motion"
					);
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let j = size - 2; j >= 0; --j) {
		for (let i = 0; i < size; ++i) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(
					i,
					j,
					i,
					j + 1,
					"Collision"
				);
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i,
						j + 1,
						"Motion"
					);
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i + 1,
						j,
						"Motion"
					);
				}
			}
		}
	} while (anyCellMotionOnBoard);
	//*collision
	anyCellMotionOnBoard = false;
	for (let i = size - 2; i >= 0; --i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				anyCellMotionOnBoard = handleCellMove(
					i,
					j,
					i + 1,
					j,
					"Collision"
				);
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
					anyCellMotionOnBoard = handleCellMove(
						i,
						j,
						i + 1,
						j,
						"Motion"
					);
				}
			}
		}
	} while (anyCellMotionOnBoard);
	if (anyCellMotionOnBoardPreviously) randomCell();
}
function handleMove(motionType) {
	auxiPrevBoardConfiguration = activeBoard.map((row) => [...row]);
	const currScore = parseInt(score.innerHTML.substring(9));
	const currBestScore = parseInt(best.innerHTML.substring(8));
	if (motionType === "ArrowUp") arrowUpMove();
	if (motionType === "ArrowLeft") arrowLeftMove();
	if (motionType === "ArrowRight") arrowRightMove();
	if (motionType === "ArrowDown") arrowDownMove();
	if (
		!auxiPrevBoardConfiguration.every((row, i) =>
			row.every((el, j) => el === activeBoard[i][j])
		)
	) {
		prevBoardConfiguration = auxiPrevBoardConfiguration;
	}
	const newScore = parseInt(score.innerHTML.substring(9));
	const newBestScore = parseInt(best.innerHTML.substring(8));
	if (currScore !== newScore) prevScore = currScore;
	if (currBestScore !== newBestScore) prevBestScore = currBestScore;
}
function handleCellMove(currI, currJ, nextI, nextJ, moveType) {
	const currCell = document.getElementById(`c${currI}${currJ}`);
	const nextCell = document.getElementById(`c${nextI}${nextJ}`);
	if (activeBoard[nextI][nextJ] === 0 && moveType === "Motion") {
		activeBoard[nextI][nextJ] = activeBoard[currI][currJ];
		activeBoard[currI][currJ] = 0;
		currCell.style.transform = cellTranslateMotion(
			currI,
			currJ,
			nextI,
			nextJ
		);
		setCellPositionAndId(currCell, nextI, nextJ);
		currCell.style.removeProperty("transform");
		return (anyCellMotionOnBoardPreviously = true);
	}
	if (
		activeBoard[currI][currJ] === activeBoard[nextI][nextJ] &&
		moveType === "Collision"
	) {
		activeBoard[currI][currJ] = 0;
		nextCell.innerText = activeBoard[nextI][nextJ] *= 2;
		updateScores(activeBoard[nextI][nextJ]);
		setCellColorAndFontSize(nextCell, activeBoard[nextI][nextJ]);
		board.removeChild(currCell);
		return (anyCellMotionOnBoardPreviously = true);
	}
	return false;
}
function cellTranslateMotion(currI, currJ, nextI, nextJ) {
	if (currI > nextI) return `translateY(-${cellMotionDistance()})`;
	else if (currI < nextI) return `translateY(${cellMotionDistance()})`;
	else if (currJ < nextJ) return `translateX(${cellMotionDistance()})`;
	else return `translateX(-${cellMotionDistance()})`;
}
