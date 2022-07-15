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
  return { getChoices, getName, makeMark, getPlayerNum };
};

const playGame = (function () {
  const names = ["Player 1", "Player 2"];
  let winner = false;
  let tie = false;

  function setNames() {
    const playerOneInput = document.getElementById("playerOne").value;
    if (playerOneInput !== "") {
      names[0] = playerOneInput;
    }
    const playerTwoInput = document.getElementById("playerTwo").value;
    if (playerOneInput !== "") {
      names[1] = playerTwoInput;
    }
  }

  const playerOne = Player("playerOne", names[0]);
  const playerTwo = Player("playerTwo", names[1]);
  const players = [playerOne];

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
    let oneChoices = playerOne.getChoices();
    let twoChoices = playerTwo.getChoices();

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

  return {
    currentPlayer: getCurrentPlayer,
    updateCurrentPlayer: updateCurrentPlayer,
    checkForWinner: checkForWinner,
    winnerExists,
    tieExists,
  };
})();

const gameBoardMaker = (function () {
  let gameBoardArray = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
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
  return {
    gameBoard: gameBoard,
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
    startFormBtn.addEventListener("click", playGame.setNames);
  }

  //make it so that it doesnt continue unless the start button is hit

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
    const gameUpdates = document.querySelector(".game-updates");
    removeAllChildNodes(gameUpdates);
    let winnerUpdate = document.createElement("span");
    winnerUpdate.textContent = currentPlayer.getName() + " wins!";
    gameUpdates.appendChild(winnerUpdate);
  }

  function displayTie() {
    const gameUpdates = document.querySelector(".game-updates");
    removeAllChildNodes(gameUpdates);
    let tieUpdate = document.createElement("span");
    tieUpdate.textContent = "It's a tie!";
    gameUpdates.appendChild(tieUpdate);
  }

  displayBoard();
  displayRoundUpdates();
  // formatStart();
  return {
    displayBoard,
    displayWinner,
    displayRoundUpdates,
    displayTie,
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

function arrayInArrayChecker(arr1, arr2) {
  const containsAll = arr1.every((element) => {
    return arr2.includes(element);
  });
  return containsAll;
}
