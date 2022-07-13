const gameBoardMaker = (function () {
  let gameBoardArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  function gameBoard(player, choice) {
    let mark = gameBoardArray[choice];
    if (player == "playerOne") {
      mark = "X";
    }
    if (player == "playerTwo") {
      mark = "O";
    }
    gameBoardArray[choice] = mark;
    return gameBoardArray;
  }
  return {
    gameBoard: gameBoard,
  };
})();

const displayController = (function () {
  function makeBoard(gameBoard) {
    let counter = 0;
    const row = [];
    let boardContainer = document.createElement("div");
    boardContainer.setAttribute("id", "board-container");
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
      boardContainer.appendChild(row[i]);
    }
    return boardContainer;
  }
  function displayBoard() {
    const container = document.querySelector("#container");
    if (checkForBoard() === true) {
      removeAllChildNodes(container);
    }
    let gameboardTemp = gameBoardMaker.gameBoard();
    let displayTemp = makeBoard(gameboardTemp);
    container.appendChild(displayTemp);
  }
  displayBoard();
  return {
    displayBoard: displayBoard,
  };
})();

//make factory function for players
const Player = (name) => {
  return { name };
};

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

//helper function
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function checkForBoard() {
  const boardCheck = document.getElementById("board-container");
  if (!boardCheck) {
    return false;
  }
  return true;
}

gameBoardMaker.gameBoard("playerOne", 4);
displayController.displayBoard();
