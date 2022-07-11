const container = document.querySelector("#container");

const gameBoardMaker = (function (player) {
  let gameBoardArray = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];
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

let gameboardTemp = gameBoardMaker.gameBoard;
let displayTemp = displayController.displayBoard(gameboardTemp);

container.appendChild(displayTemp);
