'use strict';

const games = require('./games.js');
const gameModel = require('./gameModel.js');
const gameChecks = require('./gameChecks.js');
const gameApi = require('../apiActions/gameActions/api.js');
const gameUi = require('../apiActions/gameActions/ui.js');

const checkCellEmpty = function(val){
  if(val !== ""){
    // console.log('Sorry! Someone already went there.');
    return false;
  } else {
    return true;
  }
};

const updateModelValues = function(currentSymbol, clickedCell){
  gameModel.boardDict[clickedCell] = currentSymbol;
  let modelGameIndex = gameModel.boardTrans.indexOf(clickedCell);
  gameModel.newGame.cells[modelGameIndex] = currentSymbol;
  return modelGameIndex;
};

const checkGameStatus = function (){

  if(gameModel.newGame.over === false){
    return false;
  } else if(gameModel.turnCount < gameModel.maxTurnCount){
    gameModel.winner = gameModel.currentPlayer;
    gameModel.winnerString = 'Game over! ' + gameModel.currentPlayer + ' Wins!';
    gameModel.newGame.over = true;
  } else {
    gameModel.winner = null;
    gameModel.winnerString = "Game over! It's a tie!";
    gameModel.newGame.over = true;
  }

  $('#player-turn').text(gameModel.winnerString);
  $('#game-update-modal').text(gameModel.winnerString);
  $('#gameUpdateModal').modal('show');

  return true;
};

// just updates what the user sees, not the actual state
const updatePlayerTurnAnnouncement = function(){

  if(gameModel.gameType === games.gameTypes[0]){

    $('#player-turn').text(gameModel.currentPlayer + "'s Turn!");
    $('#game-update-modal').text(gameModel.currentPlayer + "'s Turn!");

  } else if(gameModel.gameType === games.gameTypes[1]){

    $('#player-turn').text(gameModel.currentPlayer);
    $('#game-update-modal').text(gameModel.currentPlayer);

  } else if(gameModel.gameType === games.gameTypes[2]){

    $('#player-turn').text(gameModel.currentPlayer);
    $('#game-update-modal').text(gameModel.currentPlayer);

  } else {
    $('#player-turn').text('An error occurred. Please start a new game.');
    $('#game-update-modal').text('An error occurred. Please start a new game.');
  }
};

const onGameCheck = function(gameObject){

  if(gameObject.over === false){

    updatePlayerTurnAnnouncement();

  } else if (gameModel.winner === null){
    gameModel.winner = 'Tie';
    gameModel.winnerString = "Game over! It's a tie!";
    gameModel.newGame.over = true;

    $('#player-turn').text(gameModel.winnerString);
    $('#game-update-modal').text(gameModel.winnerString);
    $('#gameUpdateModal').modal('show');

    $('.table-section').hide();
    $('.game-over-section').show();

  } else {
    gameModel.winner = gameModel.otherPlayer;
    gameModel.winnerString = 'Game over! ' + gameModel.otherPlayer + ' Wins!';
    gameModel.newGame.over = true;

    $('#player-turn').text(gameModel.winnerString);
    $('#game-update-modal').text(gameModel.winnerString);
    $('#gameUpdateModal').modal('show');

    $('.table-section').hide();
    $('.game-over-section').show();
  }
};

const updateAPI = function(modelGameIndex,currentSymbol){
  let updateGameData = {
    "game": {
      "cell": {
        "index": modelGameIndex,
        "value": currentSymbol
      },
      "over": gameModel.newGame.over
    }
  };

  // update game in the back end
  gameApi.updateGame(updateGameData)
  .done(gameUi.successMove)
  .then(checkGameStatus())
  .fail(gameUi.failure);
};

const togglePlayer = function(){

  // update gameType (single vs double player)
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  if(gameModel.gameOver === false){

    // swap players
    let NewPlayersSymbols = gameModel.swapPlayers(gameModel.newGame);

    gameModel.currentPlayer = NewPlayersSymbols[0];
    gameModel.otherPlayer = NewPlayersSymbols[1];
    gameModel.currentSymbol = NewPlayersSymbols[2];
    gameModel.otherSymbol  = NewPlayersSymbols[3];

    // count turn number
    gameModel.turnCount += 1;

    // check game and show responses
    onGameCheck(gameModel.newGame);

    //show changes
  }

  return true;
};

const refreshCounts = function(){

  if(gameModel.newGame === undefined ||
    gameModel.newGame === null ||
    gameModel.newGame.cells === undefined ||
    gameModel.newGame.cells === null){
    return false;
  }

  gameModel.turnCount = 0;
  gameModel.xCount = 0;
  gameModel.oCount = 0;

  let max = gameModel.maxTurnCount;

  for(let i = 0; i < max; i++){

    if(gameModel.newGame.cells[i] !== ''){
      gameModel.turnCount += 1;
    }

    if(gameModel.newGame.cells[i] === gameModel.players.symbols[gameModel.players.players[0]]){
      gameModel.xCount += 1;
    }

    if(gameModel.newGame.cells[i] === gameModel.players.symbols[gameModel.players.players[1]]){
      gameModel.oCount += 1;
    }
  }
  return true;
};

const redrawBoard = function(){

  // check that game exists
  if(gameModel.newGame === undefined ||
    gameModel.newGame === null ||
    gameModel.newGame.cells === undefined ||
    gameModel.newGame.cells === null){
    return false;
  }

  // set variables
  let max = gameModel.newGame.cells.length;

  // update board
  for(let i = 0; i < max; i++){
    $('#' + gameModel.boardTrans[i]).text(gameModel.newGame.cells[i]);
  }

  // refresh counts
  refreshCounts();

  return true;
};

const refreshGameInfoTable = function(gameObject){

  if(gameObject === null ||
    gameObject.id === null ||
    gameObject === undefined ||
    gameObject.id === undefined){

    return false;

  }else{

    $("#game-id-data").text(gameObject.id);
    $("#game-cells-data").text(gameObject.cells);
    $("#game-over-data").text(gameObject.over);

    if(gameObject.player_x === null || gameObject.player_x === undefined){
      $("#player-x-data").text("N/A");
    }else{
      $("#player-x-data").text(gameObject.player_x.email);
    }
    if(gameObject.player_o === null || gameObject.player_o === undefined){
      $("#player-o-data").text("N/A");
    }else{
      $("#player-o-data").text(gameObject.player_o.email);
    }

  }
  return true;
};

const onSetCellValue = function(){

  // update gameType (single vs double player)
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  // make sure it is your turn before you go
  if(gameModel.gameType !== games.gameTypes[0]){
    if(
      (gameModel.currentPlayer === gameModel.players.players[0] && gameModel.xCount > gameModel.oCount) ||
      (gameModel.currentPlayer === gameModel.players.players[1] && gameModel.xCount === gameModel.oCount)
      ){
        $('#awaitingMoveModal').modal('show');
        return false;
      }
    }

  // you can only go if there is an active, non-over game
  // eventually maybe these variables should be combined into one
  if(gameModel.gameOver === false && gameModel.activeGame === true){

    // the clicked cell and the value of that cell
    let currentVal = $(this).text();
    let clickedCell = this.id;

    // check if the cell is empty
    if(!checkCellEmpty(currentVal)){
      $('#spotTakenModal').modal('show');
      return false;
    } else {

      // set the new value using the currentSymbol
      $(this).text(gameModel.currentSymbol);

      // update model
      let modelGameIndex = updateModelValues(gameModel.currentSymbol, clickedCell);

      // refresh counts
      refreshCounts();

      // update game info view
      refreshGameInfoTable(gameModel.newGame);

      // check if the game is over
      gameModel.gameOver = gameChecks.checkGame(gameModel.newGame);
      gameModel.newGame.over = gameChecks.checkGame(gameModel.newGame);

      // update object for API
      updateAPI(modelGameIndex, gameModel.currentSymbol);

      // show modal if game over
      if(gameModel.gameOver === true){
        $('#game-update-modal').text(gameModel.winnerString);
        $('#gameUpdateModal').modal('show');
      } else{
        togglePlayer();
      }
    }
  } else if (gameModel.gameOver === true){
    $('.table-section').hide();
    $('#player-turn').text('Game over! Start a new Game!');
    $('#game-update-modal').text('Game over! Start a new Game!');
    $('#gameUpdateModal').modal('show');
    $('.game-over-section').show();
  } else if(gameModel.activeGame === false){
    $('#requireStartGameModal').modal('show');
  } else {
    // console.log('There is an unexpected error with gameOver');
  }

  return true;
};

const addHandlers = () => {
  $('.cell').on('click', onSetCellValue);
};

module.exports = {
  checkCellEmpty,
  updateModelValues,
  updateAPI,
  togglePlayer,
  refreshCounts,
  redrawBoard,
  refreshGameInfoTable,
  addHandlers,
  onGameCheck,
  updatePlayerTurnAnnouncement,
  checkGameStatus,
};
