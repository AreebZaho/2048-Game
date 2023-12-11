const leftC = document.querySelector("#leftC");
const rightC = document.querySelector("#rightC");
const sizeTag = document.querySelector("#sizeTag");
let size = 3;
const startOrContinueButton = document.querySelector("#startOrContinueButton");
const newGameButton = document.querySelector("#newGameButton");
let gameStarted = false;
const homeButton = document.querySelector("#homeButton");
const resetBoardButton = document.querySelector("#resetBoardButton");
const undoButton = document.querySelector("#undoButton");
const popUpBg = document.querySelector("#popUpBg");
const popUp = document.querySelector("#popUp");
const popUpYes = document.querySelector("#yes");
const popUpNo = document.querySelector("#no");
let prevBoardConfiguration;
let activeBoard;
let preservedBoards = [];
const up = document.querySelector("#up");
const left = document.querySelector("#left");
const right = document.querySelector("#right");
const down = document.querySelector("#down");
let moveInProcess = false;

//! Home Page
leftC.addEventListener("click", () => {
	size = size == 3 ? 8 : --size;
	sizeTag.innerHTML = `${size}&nbsp;x&nbsp;${size}`;
	preservedBoardExists();
});
rightC.addEventListener("click", () => {
	size = size == 8 ? 3 : ++size;
	sizeTag.innerHTML = `${size}&nbsp;x&nbsp;${size}`;
	preservedBoardExists();
});
startOrContinueButton.addEventListener("click", () => {
	gameStarted = true;
	if (startOrContinueButton.innerText == "Start Game") {
		startGame();
	} else {
		//? inner text is "Continue Game"
		activeBoard = preservedBoards.find((matrix) => matrix.length === size);
		preservedBoards = preservedBoards.filter(
			(matrix) => matrix !== activeBoard
		);
		homeAndPlayPageSwap();
		makeBoard(false);
	}
});
newGameButton.addEventListener("click", (e) => {
	preservedBoards = preservedBoards.filter((arr) => arr.length !== size);
	startGame();
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
	resetBoard();
	popUpToggle();
});
popUpNo.addEventListener("click", () => {
	popUpToggle();
});

//! Play Page
homeButton.addEventListener("click", (e) => {
	gameStarted = false;
	playPage.classList.add("hidden");
	homePage.classList.remove("hidden");
	preservedBoards.push(activeBoard.map((innerArray) => [...innerArray]));
	preservedBoardExists();
});
resetBoardButton.addEventListener("click", () => {
	popUpToggle();
});
undoButton.addEventListener("click", () => {
	activeBoard = prevBoardConfiguration.map((row) => [...row]);
	makeBoard(false);
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
function appearRandomCell(i, j, val) {}
function generateRandomCell() {
	const val = Math.floor(Math.random() * 2 + 1) * 2;
	let i, j;
	while (activeBoard[i][j] != 0) {
		i = Math.floor(Math.random() * size);
		j = Math.floor(Math.random() * size);
	}
	activeBoard[i][j] = val;
	appearRandomCell(i, j, val);
}
function homeAndPlayPageSwap() {
	homePage.classList.toggle("hidden");
	playPage.classList.toggle("hidden");
}
function makeBoard(generateRandomCells) {
	
}
function preservedBoardExists() {
	if (preservedBoards.find((matrix) => matrix.length === size)) {
		startOrContinueButton.innerText = "Continue Game";
		newGameButton.classList.remove("hidden");
	} else {
		startOrContinueButton.innerText = "Start Game";
		newGameButton.classList.add("hidden");
	}
}
function startGame() {
	activeBoard = new Array(size).fill().map(() => new Array(size).fill(0));
	homeAndPlayPageSwap();
	makeBoard(true);
}
function resetBoard() {}
function arrowUpMove() {
	console.log(1);
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
