const darkModeButton = document.querySelector("#darkMode");
const leftCaret = document.querySelector("#leftCaret");
const rightCaret = document.querySelector("#rightCaret");
const sizeTag = document.querySelector("#sizeTag");
let size = 3;
const startOrContinueButton = document.querySelector("#startOrContinueButton");
const newGameButton = document.querySelector("#newGameButton");
let gameStarted = false;
const homeButton = document.querySelector("#homeButton");
const restartGameButton = document.querySelector("#restartGameButton");
const popUpBg = document.querySelector("#popUpBg");
const popUp = document.querySelector("#popUp");
const popUpYes = document.querySelector("#yes");
const popUpNo = document.querySelector("#no");
const undoButton = document.querySelector("#undoButton");
const board = document.querySelector("#board");
let activeBoard;
let prevBoard;
let auxiPrevBoard;
let preservedBoards = [];
const score = document.querySelector("#score");
const best = document.querySelector("#best");
let prevScore = 0;
let prevBestScore = 0;
const preservedScores = new Array(6);
const preservedBestScores = new Array(6);
let processing = false;

darkModeButton.addEventListener("click", () => {
	console.log("toggle dark mode");
});

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
	start(startOrContinueButton.innerText, 0);
});
newGameButton.addEventListener("click", (e) => {
	removeFromPreservedBoards();
	renewActiveBoardArr();
	start(newGameButton.innerText, 0);
});

//! Play Page
homeButton.addEventListener("click", (e) => {
	if (cannotPerformMove()) return;
	preservedScores[size - 3] = prevScore;
	preservedBestScores[size - 3] = prevBestScore;
	gameStarted = false;
	homeAndPlayPageSwap();
	preservedBoards.push(activeBoard.map((arr) => [...arr]));
	preservedBoardOfCurrSizeExists();
});
restartGameButton.addEventListener("click", () => {
	if (cannotPerformMove()) return;
	popUpToggle();
});
function popUpToggle() {
	popUpBg.classList.toggle("hidden");
	popUp.classList.toggle("hidden");
}
popUpYes.addEventListener("click", () => {
	renewActiveBoardArr();
	start("New Game", 1);
	popUpToggle();
});
popUpNo.addEventListener("click", () => {
	popUpToggle();
});
undoButton.addEventListener("click", () => {
	if (cannotPerformMove()) return;
	activeBoard = prevBoard.map((arr) => [...arr]);
	//* both scores updated in populateBoard() based on start/new/continue so update here after populBoard() call for correct values
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
	if (board.childElementCount == 2 * size * size && determineGameOver()) {
		gameOver();
		return;
	}
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
	return !gameStarted || !popUpBg.classList.contains("hidden") || processing;
}
function cellMargin() {
	return size < 5 ? 6 : size < 7 ? 4 : 2.5;
}
function boardDimension() {
	return board.getBoundingClientRect().height;
}
function cellDimension() {
	return `${(boardDimension() - cellMargin() * 2 * size - 12) / size}px`;
}
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
async function start(start$newGameOrContinueGame, usingRestartButton) {
	processing = true;
	if (!usingRestartButton) homeAndPlayPageSwap();
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
	await populateBoard(start$newGameOrContinueGame);
	// console.log("populated");
	processing = false;
	gameStarted = true;
}
async function populateBoard(start$newGameOrContinueGame) {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
	fillCellContainers();
	await new Promise((res) => {
		if (
			start$newGameOrContinueGame === "Start Game" ||
			start$newGameOrContinueGame === "New Game"
		) {
			cellAppear();
			cellAppear();
		} else fillCellsForContinueGame();
		setTimeout(() => {
			res();
		}, 50 + cellAppearDuration);
	});
	prevBoard = activeBoard.map((arr) => [...arr]);
}
function fillCellContainers() {
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			const cellContainer = document.createElement("div");
			cellContainer.id = `${i}${j}`;
			cellContainer.classList.add("cellContainer");
			cellContainer.style.height = cellDimension();
			cellContainer.style.margin = `${cellMargin()}px`;
			board.appendChild(cellContainer);
		}
	}
}
function fillCellsForContinueGame() {
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			if (activeBoard[i][j] !== 0) {
				cellAppear(createCell(i, j));
			}
		}
	}
}
function cellAppear(cell) {
	if (!cell) {
		do {
			i = Math.floor(Math.random() * size);
			j = Math.floor(Math.random() * size);
		} while (activeBoard[i][j] != 0);
		activeBoard[i][j] = Math.floor(Math.random() * 10) == 9 ? 4 : 2;
		cell = createCell(i, j);
	}
	cell.style.transitionDuration = `${cellAppearDuration}ms`;
	cell.style.transform = "scale(0)";
	board.appendChild(cell);
	setTimeout(() => {
		cell.style.transform = "none";
	}, 50);
	setTimeout(() => {
		cell.style.transitionDuration = `${cellTranslationDuration()}ms`;
	}, 50 + cellAppearDuration);
}
function createCell(i, j) {
	const cell = document.createElement("div");
	const val = activeBoard[i][j];
	cell.classList.add("cell");
	cell.style.height = cellDimension();
	cell.style.margin = `${cellMargin()}px`;
	const container = document
		.getElementById(`${i}${j}`)
		.getBoundingClientRect();
	cell.style.top = `${container.top - cellMargin()}px`;
	cell.style.left = `${container.left - cellMargin()}px`;
	cell.id = `c${i}${j}`;
	setCellValColorFontsz(cell, val);
	//*for cell transition only
	cell.addEventListener("transitionend", function (e) {
		if (!e.propertyName.startsWith("translate")) return;
		const computedStyle = window.getComputedStyle(cell);
		const matrix = new WebKitCSSMatrix(computedStyle.transform);
		const translatedX = matrix.m41;
		const translatedY = matrix.m42;
		cell.style.top = `${parseFloat(cell.style.top) + translatedY}px`;
		cell.style.left = `${parseFloat(cell.style.left) + translatedX}px`;
		cell.style.transform = "none";
		console.log(
			cell.id,
			"transY: ",
			translatedY,
			"transX: ",
			translatedX,
			"top:",
			cell.style.top,
			"left:",
			cell.style.left
		);
	});
	return cell;
}
function setCellValColorFontsz(cell, val) {
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
const cellAppearDuration = 200;
function oneUnitTranslationDistance() {
	return parseFloat(cellDimension()) + 2 * cellMargin();
}
function cellTranslationDuration() {
	return 4000;
}
const cellCollisionDuration = 1000;
function updateScores(val) {
	const currScore = parseInt(score.innerHTML.substring(9));
	const currBestScore = parseInt(best.innerHTML.substring(8));
	prevScore = currScore;
	prevBestScore = currBestScore;
	const newScore = currScore + val;
	const newBestScore = Math.max(newScore, currBestScore);
	//*animation: use blink or a number floting up with +scoreAddition when updated
	score.innerHTML = `SCORE<br>${newScore}`;
	best.innerHTML = `BEST<br>${newBestScore}`;
}
async function handleMove(direction) {
	// console.log("in handleMove");
	processing = true;
	auxiPrevBoard = activeBoard.map((arr) => [...arr]);
	const cellTranslations = [];
	const {scoreAddition, translationsExist} = determineCellTranslations(
		cellTranslations,
		direction
	);
	// console.log(scoreAddition + " " + translationsExist);
	if (translationsExist) {
		prevBoard = auxiPrevBoard;
		await translationsAndCollisions(
			cellTranslations,
			direction,
			scoreAddition
		);
		console.log("trans,col done : back in handleMove");
		await new Promise((res) => {
			if (scoreAddition) updateScores(scoreAddition);
			cellAppear();
			setTimeout(() => {
				console.log(
					"after trans,col : cell appear,score updation done"
				);
				res();
			}, 50 + cellAppearDuration);
		});
	} else console.log("no cell appear :=: no trans exist");
	processing = false;
}
function determineCellTranslations(cellTranslations, direction) {
	let scoreAddition = 0;
	switch (direction) {
		case "ArrowUp":
			for (let i = 1; i < size; ++i) {
				for (let j = 0; j < size; ++j) {
					if (activeBoard[i][j] !== 0) {
						const arr = [i, i, j, j, 0];
						cellTranslations.push(arr);
					}
				}
			}
			cellTranslations.forEach((arr) => {
				const i = arr[1];
				const j = arr[2];
				let nextI = i;
				while (0 < nextI && activeBoard[nextI - 1][j] === 0) --nextI;
				arr[1] = nextI;
				activeBoard[nextI][j] = activeBoard[i][j];
				if (nextI !== i) activeBoard[i][j] = 0;
			});
			cellTranslations.forEach((arr) => {
				const i = arr[1];
				const j = arr[2];
				if (0 < i && activeBoard[i][j] === activeBoard[i - 1][j]) {
					arr[1] = i - 1;
					arr[4] = 1;
					activeBoard[i][j] = 0;
					scoreAddition += activeBoard[i - 1][j] *= 2;
				}
			});
			cellTranslations = cellTranslations.filter((arr) => {
				const i = arr[1];
				const j = arr[2];
				let nextI = i;
				while (0 < nextI && activeBoard[nextI - 1][j] === 0) --nextI;
				arr[1] = nextI;
				activeBoard[nextI][j] = activeBoard[i][j];
				if (nextI !== i) activeBoard[i][j] = 0;
				return arr[0] !== arr[1];
			});
			break;
		case "ArrowDown":
			for (let i = size - 2; i >= 0; --i) {
				for (let j = 0; j < size; ++j) {
					if (activeBoard[i][j] !== 0) {
						const arr = [i, i, j, j, 0];
						cellTranslations.push(arr);
					}
				}
			}
			cellTranslations.forEach((arr) => {
				const i = arr[1];
				const j = arr[2];
				let nextI = i;
				while (nextI < size - 1 && activeBoard[nextI + 1][j] === 0)
					++nextI;
				arr[1] = nextI;
				activeBoard[nextI][j] = activeBoard[i][j];
				if (nextI !== i) activeBoard[i][j] = 0;
			});
			cellTranslations.forEach((arr) => {
				const i = arr[1];
				const j = arr[2];
				if (
					i < size - 1 &&
					activeBoard[i][j] === activeBoard[i + 1][j]
				) {
					arr[1] = i + 1;
					arr[4] = 1;
					activeBoard[i][j] = 0;
					scoreAddition += activeBoard[i + 1][j] *= 2;
				}
			});
			cellTranslations = cellTranslations.filter((arr) => {
				const i = arr[1];
				const j = arr[2];
				let nextI = i;
				while (nextI < size - 1 && activeBoard[nextI + 1][j] === 0)
					++nextI;
				arr[1] = nextI;
				activeBoard[nextI][j] = activeBoard[i][j];
				if (nextI !== i) activeBoard[i][j] = 0;
				return arr[0] !== arr[1];
			});
			break;
		case "ArrowLeft":
			for (let j = 1; j < size; ++j) {
				for (let i = 0; i < size; ++i) {
					if (activeBoard[i][j] !== 0) {
						const arr = [i, i, j, j, 0];
						cellTranslations.push(arr);
					}
				}
			}
			cellTranslations.forEach((arr) => {
				const i = arr[0];
				const j = arr[3];
				let nextJ = j;
				while (0 < nextJ && activeBoard[i][nextJ - 1] === 0) --nextJ;
				arr[3] = nextJ;
				activeBoard[i][nextJ] = activeBoard[i][j];
				if (nextJ !== j) activeBoard[i][j] = 0;
			});
			cellTranslations.forEach((arr) => {
				const i = arr[0];
				const j = arr[3];
				if (0 < j && activeBoard[i][j] === activeBoard[i][j - 1]) {
					arr[3] = j - 1;
					arr[4] = 1;
					activeBoard[i][j] = 0;
					scoreAddition += activeBoard[i][j - 1] *= 2;
				}
			});
			cellTranslations = cellTranslations.filter((arr) => {
				const i = arr[0];
				const j = arr[3];
				let nextJ = j;
				while (0 < nextJ && activeBoard[i][nextJ - 1] === 0) --nextJ;
				arr[3] = nextJ;
				activeBoard[i][nextJ] = activeBoard[i][j];
				if (nextJ !== j) activeBoard[i][j] = 0;
				return arr[2] !== arr[3];
			});
			break;
		default:
			for (let j = size - 2; j >= 0; --j) {
				for (let i = 0; i < size; ++i) {
					if (activeBoard[i][j] !== 0) {
						const arr = [i, i, j, j, 0];
						cellTranslations.push(arr);
					}
				}
			}
			cellTranslations.forEach((arr) => {
				const i = arr[0];
				const j = arr[3];
				let nextJ = j;
				while (nextJ < size - 1 && activeBoard[i][nextJ + 1] === 0)
					++nextJ;
				arr[3] = nextJ;
				activeBoard[i][nextJ] = activeBoard[i][j];
				if (nextJ !== j) activeBoard[i][j] = 0;
			});
			cellTranslations.forEach((arr) => {
				const i = arr[0];
				const j = arr[3];
				if (
					j < size - 1 &&
					activeBoard[i][j] === activeBoard[i][j + 1]
				) {
					arr[3] = j + 1;
					arr[4] = 1;
					activeBoard[i][j] = 0;
					scoreAddition += activeBoard[i][j + 1] *= 2;
				}
			});
			cellTranslations = cellTranslations.filter((arr) => {
				const i = arr[0];
				const j = arr[3];
				let nextJ = j;
				while (nextJ < size - 1 && activeBoard[i][nextJ + 1] === 0)
					++nextJ;
				arr[3] = nextJ;
				activeBoard[i][nextJ] = activeBoard[i][j];
				if (nextJ !== j) activeBoard[i][j] = 0;
				return arr[2] !== arr[3];
			});
	}
	// cellTranslations.forEach((arr) => {
	// 	console.log(arr[0], arr[1], arr[2], arr[3], arr[4]);
	// });
	return {scoreAddition, translationsExist: cellTranslations.length};
}
async function translationsAndCollisions(
	cellTranslations,
	direction,
	scoreAddition
) {
	// console.log("in transAndCol");
	await new Promise((res) => {
		for (let t = 0; t < cellTranslations.length; ++t) {
			const arr = cellTranslations[t];
			const cell = document.getElementById(`c${arr[0]}${arr[2]}`);
			const totalTranslationDistance =
				oneUnitTranslationDistance() *
				(arr[1] - arr[0] + arr[3] - arr[2]);
			cell.style.transform = `translate${
				direction === "ArrowUp" || direction === "ArrowDown" ? "Y" : "X"
			}(${totalTranslationDistance}px)`;
			// console.log("cell ", cell.id);
			setTimeout(() => {
				console.log("motion done");
				//* for cell translations only
				// if (direction === "ArrowUp" || direction === "ArrowDown") {
				// 	cell.style.top = `${
				// 		parseFloat(cell.style.top) + totalTranslationDistance
				// 	}px`;
				// } else {
				// 	cell.style.left = `${
				// 		parseFloat(cell.style.left) + totalTranslationDistance
				// 	}`;
				// }
				// cell.style.transform = "none";
				//* for cell collisions (timeout after collisions' timeout done)
				// if (arr[4]) {
				// 	let i = -1;
				// 	while (++i < cellTranslations.length) {
				// 		if (
				// 			cellTranslations[i][1] === arr[1] &&
				// 			cellTranslations[i][3] === arr[3]
				// 		)
				// 			break;
				// 	}
				// 	const destinationCell = document.getElementById(
				// 		`c${cellTranslations[i][1]}${cellTranslations[i][3]}`
				// 	);
				// 	// console.log("dc ", destinationCell.id);
				// 	cell.style.transitionDuration = `${cellCollisionDuration}ms`;
				// 	cell.style.transform = "scale(1.15)";
				// 	setTimeout(() => {
				// 		setCellValColorFontsz(
				// 			cell,
				// 			activeBoard[arr[1]][arr[3]]
				// 		);
				// 		board.removeChild(destinationCell);
				// 		cell.style.transform = "none";
				// 	}, cellCollisionDuration);
				// 	setTimeout(() => {
				// 		cell.style.transitionDuration = `${cellTranslationDuration()}ms`;
				// 		if (t === cellTranslations.length - 1) res();
				// 	}, 2 * cellCollisionDuration);
				// }
				cell.id = `c${arr[1]}${arr[3]}`;
				// if (t === cellTranslations.length - 1) res();
				// * if no score addition then res here only instead of in if(arr[4]): collision true block
				if (!scoreAddition && t === cellTranslations.length - 1) res();
			}, cellTranslationDuration());
		}
	});
}
//* in handleMove check if board full and motion in all directions celltranslations length = 0
//* display game over visual (but don't reset board): diplayed each time arrow key clicked but board not reset
function gameOver() {}
//*when 2048 achieved win visual but don't reset board
function gameWin() {}
