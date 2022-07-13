const gameBoardMaker = (function (player) {
  let gameBoardArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  return {
    gameBoard: gameBoardArray,
  };
})();

const displayController = (function (gameBoard) {
  function displayBoard(gameBoard) {
    let counter = 0;
    const row = [];
    let gridContainer = document.createElement("div");
    for (let i = 0; i < 3; i++) {
      row[i] = document.createElement("div");
      row[i].classList.add("row");
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-Id", counter);
        cell.textContent = gameBoard[counter];
        row[i].appendChild(cell);
        counter++;
      }
      gridContainer.appendChild(row[i]);
    }
    return gridContainer;
  }
  return {
    displayBoard: displayBoard,
  };
})();

//make factory function for players
const Player = (name) => {
  return { name };
};

const container = document.querySelector("#container");
let gameboardTemp = gameBoardMaker.gameBoard;
let displayTemp = displayController.displayBoard(gameboardTemp);
container.appendChild(displayTemp);

const formatCells = (function () {
  const cells = document.querySelectorAll(".cell");
  console.log(cells.length);
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      let gameBoardIndex = cell.getAttribute("data-ID");
      console.log(gameBoardIndex);
    });
  });
})();

const formatStart = (function () {
  const cell = document.querySelector(".start-btn");
  cell.addEventListener("click", () => {
    console.log("pp");
  });
})();

const playGame = (function () {})();
