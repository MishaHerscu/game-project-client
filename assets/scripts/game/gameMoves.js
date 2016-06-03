'use strict';

const games = require('./games.js');
const gameModel = require('./gameModel.js');
const gameChecks = require('./gameChecks.js');
const turnEffects = require('./turnEffects.js');

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

const updatePlayerTurnAnnouncement = function(){

  // update gameType (single vs double player)
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

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
    console.log('There is an unexpected error with updatePlayerTurnAnnouncement');
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

const onSetCellValue = function(){

  // refresh counts
  refreshCounts();

  // update gameType (single vs double player)
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  // // manually change gameType if necessary
  // let playerXCheck = true;
  // let playerOCheck = false;
  //
  // if(gameModel.newGame.player_x !== undefined && gameModel.newGame.player_x !== null){
  //   playerXCheck = true;
  // } else {
  //   playerXCheck = false;
  // }
  //
  // if(gameModel.newGame.player_o !== undefined && gameModel.newGame.player_o !== null){
  //   playerOCheck = true;
  // } else {
  //   playerOCheck = false;
  // }
  //
  // if(playerXCheck === true && playerOCheck === true){
  //   gameModel.gameType = games.gameTypes[1];
  // } else if(playerXCheck === true){
  //   gameModel.gameType = games.gameTypes[0];
  // }

  // make sure it is your turn before you go
  if(gameModel.gameType === games.gameTypes[1]){
    if(
      (gameModel.currentPlayer === gameModel.players.players[0] && gameModel.xCount > gameModel.oCount) ||
      (gameModel.currentPlayer === gameModel.players.players[1] && gameModel.xCount === gameModel.oCount)
      ){

      console.log('waiting for other player...');

      return false;
    }
  }

  // you can only go if there is an active, non-over game
  // eventually maybe these variables should be combined into one
  if(gameModel.gameOver === false && gameModel.activeGame === true){

    // update gameType (single vs double player)
    gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

    // the clicked cell and the value of that cell
    let currentVal = $(this).text();
    let clickedCell = this.id;

    // check if the cell is empty
    if(!turnEffects.checkCellEmpty(currentVal)){
      return false;
    } else {

      // set the new value using the currentSymbol
      $(this).text(gameModel.currentSymbol);

      // refresh counts
      refreshCounts();

      // update model
      let modelGameIndex = turnEffects.updateModelValues(gameModel.currentSymbol, clickedCell);

      // update game info view
      refreshGameInfoTable(gameModel.newGame);

      // check if the game is over
      gameModel.gameOver = gameChecks.checkGame();

      // update object for API
      turnEffects.updateAPI(modelGameIndex, gameModel.currentSymbol);
    }
  } else if (gameModel.gameOver === true){

    console.log('The game is over! Start a new game!');
    $('.table-section').hide();

    $('#player-turn').text('Game over! Start a new Game!');
    $('#game-update-modal').text('Game over! Start a new Game!');

    $('.game-over-section').show();

  } else if(gameModel.activeGame === false){
    console.log('You need to activate or start a game!');

  } else {
    console.log('There is an unexpected error with gameOver');
  }

  return true;
};

const addHandlers = () => {
  $('.cell').on('click', onSetCellValue);
};


module.exports = {
  refreshCounts,
  redrawBoard,
  refreshGameInfoTable,
  addHandlers,
  onGameCheck,
  updatePlayerTurnAnnouncement,
};
