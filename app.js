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
let anyCellMotionOnBoardPreviously = false;
let prevScore = 0;
let prevBestScore = 0;
const score = document.querySelector("#score");
const best = document.querySelector("#best");
let processing = false;

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
function isPopUpOpen() {
	return !popUpBg.classList.contains("hidden");
}
function popUpToggle() {
	popUpBg.classList.toggle("hidden");
	popUp.classList.toggle("hidden");
}
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
	if (cannotPerformMove()) return;
	preservedScores[size - 3] = prevScore;
	preservedBestScores[size - 3] = prevBestScore;
	gameStarted = false;
	homeAndPlayPageSwap();
	preservedBoards.push(activeBoard.map((arr) => [...arr]));
	preservedBoardOfCurrSizeExistsAndUpdateBoardPadding();
});
restartGameButton.addEventListener("click", () => {
	if (cannotPerformMove()) return;
	popUpToggle();
});
undoButton.addEventListener("click", () => {
	if (cannotPerformMove()) return;
	activeBoard = prevBoardConfiguration.map((arr) => [...arr]);
	//* both scores updates in populateBoard() based on start/new/continue so update here after func() call for correct values
	score.innerHTML = `SCORE<br>${prevScore}`;
	best.innerHTML = `BEST<br>${prevBestScore}`;
	populateBoard("Continue Game ?");
});
let startX, startY, endX, endY;
board.addEventListener("touchstart", handleInput);
board.addEventListener("touchmove", handleInput);
board.addEventListener("touchend", handleInput);
document.addEventListener("keydown", handleInput);
function handleInput(e) {
	if (cannotPerformMove()) return;
	if (e.type !== "keydown") e.preventDefault();
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
			if (
				e.key === "ArrowUp" ||
				e.key === "ArrowDown" ||
				e.key === "ArrowLeft" ||
				e.key === "ArrowRight"
			)
				handleMove(e.key);
	}
}

//! Functions
function cannotPerformMove() {
	return !gameStarted || isPopUpOpen() || processing;
}
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
function cellDimension() {
	return `${(boardDimension() - 4 * 2 * size - 13) / size}px`;
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
		cellAppear();
		cellAppear();
	}
	prevBoardConfiguration = activeBoard.map((arr) => [...arr]);
}
function fillCellContainers() {
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			const cellContainer = document.createElement("div");
			cellContainer.id = `${i}${j}`;
			cellContainer.classList.add("cellContainer");
			cellContainer.style.height = `${cellDimension()}`;
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
function cellAppear() {
	do {
		i = Math.floor(Math.random() * size);
		j = Math.floor(Math.random() * size);
	} while (activeBoard[i][j] != 0);
	activeBoard[i][j] = Math.floor(Math.random() * 10) == 9 ? 4 : 2;
	const cell = createCell(i, j);
	board.appendChild(cell);
	cell.style.transitionDuration = "150ms";
	cell.style.transform = "scale(0)";
	setTimeout(() => {
		cell.style.transform = "none";
		cell.style.transitionDuration = `${cellTransitionDuration()}ms`;
	}, 150);
}
function createCell(i, j) {
	const cell = document.createElement("div");
	const val = activeBoard[i][j];
	cell.classList.add("cell");
	cell.style.height = cellDimension();
	setCellPositionAndId(cell, i, j);
	setCellValAndColorAndFontSize(cell, val);
	return cell;
}
function setCellPositionAndId(cell, i, j) {
	const container = document
		.getElementById(`${i}${j}`)
		.getBoundingClientRect();
	cell.style.top = `${container.top - 4}px`;
	cell.style.left = `${container.left - 4}px`;
	cell.id = `c${i}${j}`;
}
function setCellValAndColorAndFontSize(cell, val) {
	cell.innerText = val;
	cell.classList.add(`tile${val}`); //*only for background color as font size dependent on cell dimension
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
	cell.style.fontSize = `${parseInt(cell.style.height) * factor}px`;
}
function oneUnitTranslationDistance() {
	return parseFloat(cellDimension()) + 8;
}
function cellTransitionDuration() {
	return 100;
}
function updateScores(val) {
	const currScore = parseInt(score.innerHTML.substring(9));
	const currBestScore = parseInt(best.innerHTML.substring(8));
	//*animation + updation
	score.innerHTML = `SCORE<br>${currScore + val}`;
	best.innerHTML = `BEST<br>${Math.max(currScore + val, currBestScore)}`;
}
async function handleMove(direction) {
	processing = true;
	auxiPrevBoardConfiguration = activeBoard.map((row) => [...row]);
	const currScore = parseInt(score.innerHTML.substring(9));
	const currBestScore = parseInt(best.innerHTML.substring(8));
	let scoreAddition = 0;
	if (direction === "ArrowUp") scoreAddition = await arrowUp();
	else if (direction === "ArrowLeft") scoreAddition = arrowLeft();
	else if (direction === "ArrowRight") scoreAddition = arrowRight();
	else scoreAddition = arrowDown();
	console.log("returned " + scoreAddition);
	updateScores(scoreAddition);
	const newScore = parseInt(score.innerHTML.substring(9));
	const newBestScore = parseInt(best.innerHTML.substring(8));
	if (currScore !== newScore) prevScore = currScore;
	if (currBestScore !== newBestScore) prevBestScore = currBestScore;
	if (
		!auxiPrevBoardConfiguration.every((row, i) =>
			row.every((el, j) => el === activeBoard[i][j])
		)
	) {
		prevBoardConfiguration = auxiPrevBoardConfiguration;
		cellAppear();
	}
	processing = false;
}
async function arrowUp() {
	const cellTranslations = [];
	for (let i = 1; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				const arr = [i, i, j, 0];
				cellTranslations.push(arr);
			}
		}
	}
	cellTranslations.forEach((arr) => {
		const i = arr[1];
		const j = arr[2];
		let nextI = i;
		while (nextI > 0 && activeBoard[nextI - 1][j] === 0) --nextI;
		arr[1] = nextI;
		activeBoard[nextI][j] = activeBoard[i][j];
		if (nextI !== i) activeBoard[i][j] = 0;
	});
	let scoreAddition = 0;
	cellTranslations.forEach((arr) => {
		const i = arr[1];
		const j = arr[2];
		if (i > 0 && activeBoard[i][j] === activeBoard[i - 1][j]) {
			arr[1] = i - 1;
			arr[3] = 1;
			activeBoard[i][j] = 0;
			scoreAddition += activeBoard[i - 1][j] *= 2;
		}
	});
	cellTranslations.forEach((arr) => {
		const i = arr[1];
		const j = arr[2];
		let nextI = i;
		while (nextI > 0 && activeBoard[nextI - 1][j] === 0) --nextI;
		arr[1] = nextI;
		activeBoard[nextI][j] = activeBoard[i][j];
		if (nextI !== i) activeBoard[i][j] = 0;
	});
	await new Promise((res) => {
		for (let t = 0; t < cellTranslations.length; ++t) {
			const arr = cellTranslations[t];
			const totalTranslationDistance =
				oneUnitTranslationDistance() * (arr[1] - arr[0]);
			const cell = document.getElementById(`c${arr[0]}${arr[2]}`);
			cell.style.transform = `translateY(${totalTranslationDistance}px)`;
			console.log(1);
			setTimeout(() => {
				const transformValues = getComputedStyle(cell).transform.match(
					/translateX\((.+?)\) translateY\((.+?)\)/
				);
				if (transformValues) {
					const translateX = parseInt(transformValues[1]);
					const translateY = parseInt(transformValues[2]);
					cell.style.left = `${cell.offsetLeft + translateX}px`;
					cell.style.top = `${cell.offsetTop + translateY}px`;
					cell.style.transform = "none";
				}
				if (arr[3] === 1) {
					let i = -1;
					while (++i < cellTranslations.length) {
						if (cellTranslations[i][1] == arr[1]) break;
					}
					const newCell = document.getElementById(
						`c${cellTranslations[i][0]}${cellTranslations[i][2]}`
					);
					board.removeChild(cell);
					newCell.style.transitionDuration = "150ms";
					newCell.style.transform = "scale(1.15)";
					// setTimeout(() => {
					// 	setCellValAndColorAndFontSize(
					// 		cell,
					// 		activeBoard[arr[1]][arr[2]]
					// 	);
					// 	cell.style.transform = "none";
					// 	cell.style.transitionDuration = `${cellTransitionDuration()}ms`;
					// }, 150);
				} else cell.id = `c${arr[1]}${arr[2]}`;
				console.log(2);
				if (t === cellTranslations.length - 1) res();
			}, cellTransitionDuration());
		}
	});
	console.log("resolved");
	return scoreAddition;
}
function arrowLeft() {
	anyCellMotionOnBoardPreviously = false;
	//*motion
	let anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let j = 1; j < size; ++j) {
			for (let i = 0; i < size; ++i) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleMotion(
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
				anyCellMotionOnBoard = handleMotion(
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
					anyCellMotionOnBoard = handleMotion(
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
	if (anyCellMotionOnBoardPreviously) cellAppear();
}
function arrowRight() {
	anyCellMotionOnBoardPreviously = false;
	//*motion
	let anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let j = size - 2; j >= 0; --j) {
			for (let i = 0; i < size; ++i) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleMotion(
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
				anyCellMotionOnBoard = handleMotion(
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
					anyCellMotionOnBoard = handleMotion(
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
	if (anyCellMotionOnBoardPreviously) cellAppear();
}
function arrowDown() {
	anyCellMotionOnBoardPreviously = false;
	//*motion
	let anyCellMotionOnBoard = false;
	do {
		anyCellMotionOnBoard = false;
		for (let i = size - 2; i >= 0; --i) {
			for (let j = 0; j < size; ++j) {
				if (activeBoard[i][j] !== 0) {
					anyCellMotionOnBoard = handleMotion(
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
				anyCellMotionOnBoard = handleMotion(
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
					anyCellMotionOnBoard = handleMotion(
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
	if (anyCellMotionOnBoardPreviously) cellAppear();
}
function handleMotion(currI, currJ, nextI, nextJ, moveType) {
	const currCell = document.getElementById(`c${currI}${currJ}`);
	const nextCell = document.getElementById(`c${nextI}${nextJ}`);
	if (activeBoard[nextI][nextJ] === 0 && moveType === "Motion") {
		activeBoard[nextI][nextJ] = activeBoard[currI][currJ];
		activeBoard[currI][currJ] = 0;
		// currCell.style.transform = translation(currI, currJ, nextI, nextJ);
		currCell.style.removeProperty("transform");
		setCellPositionAndId(currCell, nextI, nextJ);
		return (anyCellMotionOnBoardPreviously = true);
	}
	if (
		activeBoard[currI][currJ] === activeBoard[nextI][nextJ] &&
		moveType === "Collision"
	) {
		activeBoard[currI][currJ] = 0;
		nextCell.innerText = activeBoard[nextI][nextJ] *= 2;
		updateScores(activeBoard[nextI][nextJ]);
		setCellValAndColorAndFontSize(nextCell, activeBoard[nextI][nextJ]);
		board.removeChild(currCell);
		return (anyCellMotionOnBoardPreviously = true);
	}
	return false;
}
