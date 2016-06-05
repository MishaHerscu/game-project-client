'use strict';

const gameModel = require('./gameModel.js');
const gameMoves = require('./gameModel.js');
const gameApi = require('../apiActions/gameActions/api.js');
const gameUi = require('../apiActions/gameActions/ui.js');
const turnEffects = require('./gameModel.js');

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
  .then(turnEffects.checkGameStatus)
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
    gameMoves.onGameCheck(gameModel.newGame);

    //show changes
  }

  return true;
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

  $('.table-section').hide();
  $('.game-over-section').show();

  return true;
};

module.exports = {
  checkCellEmpty,
  updateModelValues,
  updateAPI,
  togglePlayer,
  checkGameStatus,
};
