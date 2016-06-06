'use strict';

// imports
const gameModel = require('./gameModel.js');
const players = require('./players.js');

const checkGame = function(gameObject) {
  let gameOver = false;

  let winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for(let i = 0; i < winConditions.length; i++){

    let checkVal = gameObject.cells[winConditions[i][0]];

    if(checkVal !== ''){
      let match = true;

      for(let j = 0; j < gameModel.gameSize; j++){

        if(gameObject.cells[winConditions[i][j]] !== checkVal){
          match = false;
        }
      }

      if(match === true){

        gameOver = true;
        gameModel.gameOver = true;
        gameModel.newGame.over = true;

        if(checkVal === players.symbols[players.players[0]]){
          gameModel.winner = players.players[0];
          gameModel.winnerString = 'Game over! ' + gameModel.winner + ' Wins!';

        } else if(checkVal === players.symbols[players.players[1]]){
          gameModel.winner = players.players[1];
          gameModel.winnerString = 'Game over! ' + gameModel.winner + ' Wins!';

        }
        $('#player-turn').text(gameModel.winnerString);
        $('#game-update-modal').text(gameModel.winnerString);
        $('#gameUpdateModal').modal('show');
        $('.table-section').hide();
        $('.game-over-section').show();
        return gameOver;
      }
    }
  }

  if(gameModel.turnCount === gameModel.maxTurnCount || gameModel.turnCount > gameModel.maxTurnCount){
    gameOver = true;
    gameModel.winner = null;
    gameModel.winnerString = "Game over! It's a tie!";
    $('#player-turn').text(gameModel.winnerString);
    $('#game-update-modal').text(gameModel.winnerString);
    $('#gameUpdateModal').modal('show');
    $('.table-section').hide();
    $('.game-over-section').show();
    return gameOver;
  }
  return gameOver;
};

const checkGameOutcome = function(gameObject){

  let gameStatus;
  let cells = gameObject.cells;

  let winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  // first check for victories
  for(let i = 0; i < winConditions.length; i++){

    let checkVal = cells[winConditions[i][0]];

    if(checkVal !== ''){
      let match = true;

      for(let j = 0; j < gameModel.gameSize; j++){

        if(gameObject.cells[winConditions[i][j]] !== checkVal){
          match = false;
        }
      }

      if(match === true){
        gameStatus = checkVal;
        return gameStatus; // this should be X, or O, as a winner
    }
  }
}

// check for ties
let gameTurnCount = 0;
for(let i = 0; i < gameModel.gameSize; i++){
  if(cells[i] !== ''){
    gameTurnCount += 1;
  }
}
if(gameTurnCount === gameModel.gameSize){
  gameStatus = 'tie';
  return gameStatus;
}

// the last option is an "in-progress" game
gameStatus = 'in progress';
return gameStatus;

};

module.exports = {
  checkGame,
  checkGameOutcome,
};
