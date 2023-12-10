const leftC = document.querySelector("#leftC");
const rightC = document.querySelector("#rightC");
const sizeTag = document.querySelector("#sizeTag");
let size = 3;
const startOrContinueButton = document.querySelector("#startOrContinueButton");
const newGameButton = document.querySelector("#newGameButton");
let gameStarted = false;
const homeButton = document.querySelector("#homeButton");
const resetboardButton = document.querySelector("#resetboardButton");
const undoButton = document.querySelector("#undoButton");
const popUpBg = document.querySelector("#popUpBg");
const popUp = document.querySelector("#popUp");
const popUpYes = document.querySelector("#yes");
const popUpNo = document.querySelector("#no");
let activeBoard;
let preservedBoards;

//* Home Page
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
	homePage.classList.add("hidden");
	playPage.classList.remove("hidden");
	if (startOrContinueButton.innerText == "Start Game") {
		activeBoard = new Array(size).fill().map(() => new Array(size).fill(0));
		generateRandomCell();
		generateRandomCell();
	} else {
		//? inner text is "Continue Game"
		activeBoard = preservedBoards.find((matrix) => matrix.length === size);
		preservedBoards = preservedBoards.filter(
			(matrix) => matrix !== activeBoard
		);
	}
});

//* Pop Up
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

//* Play Page
homeButton.addEventListener("click", (e) => {
	gameStarted = false;
	playPage.classList.add("hidden");
	homePage.classList.remove("hidden");
	preservedBoards.push(activeBoard.map((innerArray) => [...innerArray]));
	preservedBoardExists();
});
resetboardButton.addEventListener("click", () => {
	popUpToggle();
});

//* Functions
const generateRandomCell = () => {};
const preservedBoardExists = () => {
	if (preservedBoards.find((matrix) => matrix.length === size)) {
		startOrContinueButton.innerText = "Continue Game";
		newGameButton.classList.remove("hidden");
	} else {
		startOrContinueButton.innerText = "Start Game";
		newGameButton.classList.add("hidden");
	}
};
const resetBoard = () => {};
