const Player = (name) => {
  const choices = [];
  const getName = () => name;
  const makeMark = (choice) => {
    choices.push(choice);
    gameBoardMaker.gameBoard(name, choice);
    displayController.displayBoard();
  };
  getChoices = () => choices;
  return { getChoices, getName, makeMark };
};

const playGame = (function () {
  const playerOne = Player("playerOne");
  const playerTwo = Player("playerTwo");
  players = [playerOne];

  function getCurrentPlayer() {
    let currentPlayer = players[players.length - 1];
    return currentPlayer;
  }

  function updateCurrentPlayer() {
    let currentPlayer = getCurrentPlayer();
    if (currentPlayer == playerOne) {
      players.push(playerTwo);
    }
    if (currentPlayer == playerTwo) {
      players.push(playerOne);
    }
  }
  return {
    currentPlayer: getCurrentPlayer,
    updateCurrentPlayer: updateCurrentPlayer,
  };
})();

const gameBoardMaker = (function () {
  let gameBoardArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  function gameBoard(player, choice) {
    let mark = gameBoardArray[choice];
    if (mark == "X" || mark == "O") {
      return -1;
    }
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
    formatCells();
  }
  function formatCells() {
    const cells = document.querySelectorAll(".cell");
    console.log(cells.length);
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        let gameBoardIndex = cell.getAttribute("data-ID");
        let currentPlayer = playGame.currentPlayer();
        playGame.updateCurrentPlayer();
        console.log(currentPlayer.getName());
        currentPlayer.makeMark(gameBoardIndex);
      });
    });
  }

  displayBoard();
  return {
    displayBoard: displayBoard,
  };
})();

const formatElements = (function () {
  function formatStart() {
    const cell = document.querySelector(".start-btn");
    cell.addEventListener("click", () => {
      console.log("pp");
    });
  }
})();

//make factory function for players

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
