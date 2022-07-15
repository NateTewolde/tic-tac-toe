const Player = (playerNum, name) => {
  const choices = [];
  const getName = () => name;
  const getPlayerNum = () => playerNum;
  const makeMark = (choice) => {
    choices.push(choice);
    gameBoardMaker.gameBoard(playerNum, choice);
    displayController.displayBoard();
    playGame.checkForWinner();
  };
  getChoices = () => choices;
  clearChoices = () => {
    choices.splice(0, choices.length);
  };
  return { getChoices, getName, makeMark, getPlayerNum, clearChoices };
};

const gameBoardMaker = (function () {
  const gameBoardArray = [];
  //let gameBoardArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];

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
  function clearBoard() {
    gameBoardArray.splice(0, gameBoardArray.length);
  }
  return {
    gameBoard: gameBoard,
    clearBoard,
  };
})();

const displayController = (function () {
  function displayNameForm() {
    const nameFormSection = document.createElement("div");
    nameFormSection.setAttribute("id", "name-form-section");

    const formHeader = document.createElement("div");
    formHeader.classList.add("form-header");
    formHeader.textContent = "Enter your names:";

    const namesForm = document.createElement("form");
    namesForm.setAttribute("action", "");
    namesForm.setAttribute("method", "post");
    namesForm.setAttribute("id", "names_form");

    const playerOneField = document.createElement("div");
    playerOneField.classList.add("form-field");
    const playerOneInput = document.createElement("input");
    playerOneInput.setAttribute("type", "text");
    playerOneInput.setAttribute("name", "playerOne");
    playerOneInput.setAttribute("id", "playerOne");
    playerOneInput.setAttribute("placeholder", "Player 1");
    playerOneField.appendChild(playerOneInput);
    namesForm.appendChild(playerOneField);

    const playerTwoField = document.createElement("div");
    playerTwoField.classList.add("form-field");
    const playerTwoInput = document.createElement("input");
    playerTwoInput.setAttribute("type", "text");
    playerTwoInput.setAttribute("name", "playerTwo");
    playerTwoInput.setAttribute("id", "playerTwo");
    playerTwoInput.setAttribute("placeholder", "Player 2");
    playerTwoField.appendChild(playerTwoInput);
    namesForm.appendChild(playerTwoField);

    const startBtn = document.createElement("button");
    startBtn.classList.add("start-form-btn");
    startBtn.setAttribute("type", "button");
    startBtn.textContent = "start";
    namesForm.appendChild(startBtn);

    const container = document.querySelector("#container");

    nameFormSection.appendChild(formHeader);
    nameFormSection.appendChild(namesForm);
    container.appendChild(nameFormSection);

    startFormButton();
  }
  displayNameForm();

  function startFormButton() {
    const startFormBtn = document.querySelector(".start-form-btn");
    startFormBtn.addEventListener("click", () => {
      playGame.setNames();
      const container = document.querySelector("#container");
      removeAllChildNodes(container);
      displayBoard();
      displayRoundUpdates();
    });
  }

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
    if (playGame.winnerExists() || playGame.tieExists()) {
      return -1;
    }
    const container = document.querySelector("#container");
    if (checkForBoard() === true) {
      removeAllChildNodes(container);
    }
    let gameboardTemp = gameBoardMaker.gameBoard();
    let displayTemp = makeBoard(gameboardTemp);
    container.appendChild(displayTemp);

    formatCells();
    makeRestartButton();
  }
  function formatCells() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      if (cell.textContent == "X" || cell.textContent == "O") {
        return -1;
      }
      cell.addEventListener("click", () => {
        let gameBoardIndex = cell.getAttribute("data-ID");
        let currentPlayer = playGame.currentPlayer();
        currentPlayer.makeMark(gameBoardIndex);
        playGame.updateCurrentPlayer();
        displayRoundUpdates();
      });
    });
  }

  function makeRestartButton() {
    const restartBtnSection = document.querySelector(".restart-btn-section");
    if (checkForRestartBtn() === true) {
      removeAllChildNodes(restartBtnSection);
    }
    const restartBtn = document.createElement("button");
    restartBtn.classList.add("restart-btn");
    restartBtn.textContent = "Restart";
    restartBtnSection.appendChild(restartBtn);

    restartButton();
  }

  function restartButton() {
    const restartBtn = document.querySelector(".restart-btn");
    restartBtn.addEventListener("click", playGame.restartGame);
  }

  function displayRoundUpdates() {
    if (playGame.winnerExists() || playGame.tieExists()) {
      return -1;
    }
    let currentPlayer = playGame.currentPlayer();
    const gameUpdates = document.querySelector(".game-updates");
    removeAllChildNodes(gameUpdates);
    let roundUpdates = document.createElement("span");
    roundUpdates.textContent = currentPlayer.getName() + ", It's your move.";
    gameUpdates.appendChild(roundUpdates);
  }

  function displayWinner(currentPlayer) {
    if (playGame.winnerExists() || playGame.tieExists()) {
      return -1;
    }
    const gameUpdates = document.querySelector(".game-updates");
    removeAllChildNodes(gameUpdates);
    let winnerUpdate = document.createElement("span");
    winnerUpdate.textContent = currentPlayer.getName() + " wins!";
    gameUpdates.appendChild(winnerUpdate);
  }

  function displayTie() {
    if (playGame.winnerExists() || playGame.tieExists()) {
      return -1;
    }
    const gameUpdates = document.querySelector(".game-updates");
    removeAllChildNodes(gameUpdates);
    let tieUpdate = document.createElement("span");
    tieUpdate.textContent = "It's a tie!";
    gameUpdates.appendChild(tieUpdate);
  }

  return {
    displayBoard,
    displayWinner,
    displayRoundUpdates,
    displayTie,
  };
})();

const playGame = (function () {
  const names = [];
  const players = [];
  let winner = false;
  let tie = false;

  function setNames() {
    const playerOneInput = document.getElementById("playerOne").value;
    if (playerOneInput !== "") {
      names[0] = playerOneInput;
    } else {
      names[0] = "Player 1";
    }
    const playerTwoInput = document.getElementById("playerTwo").value;
    if (playerOneInput !== "") {
      names[1] = playerTwoInput;
    } else {
      names[1] = "Player 2";
    }
    setPlayers();
  }

  function setPlayers() {
    const playerOne = Player("playerOne", names[0]);
    const playerTwo = Player("playerTwo", names[1]);
    players.push(playerOne);
    players.push(playerTwo);
    players.push(playerOne);
  }

  function getCurrentPlayer() {
    let currentPlayer = players[players.length - 1];
    return currentPlayer;
  }

  function updateCurrentPlayer() {
    let currentPlayer = getCurrentPlayer();
    if (currentPlayer == players[0]) {
      players.push(players[1]);
    }
    if (currentPlayer == players[1]) {
      players.push(players[0]);
    }
  }

  function checkForWinner() {
    winningCombinations = [];
    winningCombinations.push(["0", "1", "2"]);
    winningCombinations.push(["3", "4", "5"]);
    winningCombinations.push(["6", "7", "8"]);
    winningCombinations.push(["0", "3", "6"]);
    winningCombinations.push(["1", "4", "7"]);
    winningCombinations.push(["2", "5", "8"]);
    winningCombinations.push(["0", "4", "8"]);
    winningCombinations.push(["2", "4", "6"]);

    let currentPlayer = getCurrentPlayer();
    playerChoices = currentPlayer.getChoices();
    for (combo in winningCombinations) {
      winningCombo = arrayInArrayChecker(
        winningCombinations[combo],
        playerChoices
      );
      if (winningCombo == true) {
        displayController.displayWinner(currentPlayer);
        winner = true;
      } else {
        checkForTie();
      }
    }
  }

  function checkForTie() {
    let oneChoices = players[0].getChoices();
    let twoChoices = players[1].getChoices();

    if (oneChoices.length + twoChoices.length === 9) {
      displayController.displayTie();
      tie = true;
    }
  }

  function winnerExists() {
    return winner;
  }

  function tieExists() {
    return tie;
  }

  function restartGame() {
    players[0].clearChoices();
    players[1].clearChoices();
    gameBoardMaker.clearBoard();
    winner = false;
    tie = false;
    let playerHolder = players[0];
    players.push(playerHolder);
    displayController.displayRoundUpdates();
    displayController.displayBoard();
  }

  return {
    currentPlayer: getCurrentPlayer,
    updateCurrentPlayer: updateCurrentPlayer,
    checkForWinner: checkForWinner,
    setNames,
    winnerExists,
    tieExists,
    restartGame,
  };
})();

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

function checkForRestartBtn() {
  const restartBtnCheck = document.querySelector(".restart-btn-section");
  if (!restartBtnCheck) {
    return false;
  }
  return true;
}

function arrayInArrayChecker(arr1, arr2) {
  const containsAll = arr1.every((element) => {
    return arr2.includes(element);
  });
  return containsAll;
}
