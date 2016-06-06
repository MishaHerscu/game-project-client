'use strict';

// imports
const gameModel = require('./gameModel.js');

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
      }
    }
  }

  if(gameModel.turnCount === gameModel.maxTurnCount || gameModel.turnCount > gameModel.maxTurnCount){
    gameOver = true;
  }

  return gameOver;
};

module.exports = {
  // checkSame,
  // checkDiags,
  checkGame,
  // newCheckGame,
};
