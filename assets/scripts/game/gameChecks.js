'use strict';

// imports
const gameModel = require('./gameModel.js');

// check whether dict values are the same
// the keys have to be 0, 1, 2 etc.
// this is based on matching the format we get from jQuery
const checkSame = function(list){
  let checkVal = gameModel.newGame.cells[list[0]];

  if(checkVal === ""){

    return false;

  }else{

    for(let i = 0, max = gameModel.gameSize; i < max; i++){
      if(gameModel.newGame.cells[list[i]] !== checkVal){
        return false;
      }
    }
  }
  gameModel.winner = gameModel.currentPlayer;
  return true;
};

// check diagonal win conditions
const checkDiags = function(){

  // define vars
  let topLeft = gameModel.newGame.cells[0];
  let topRight = gameModel.newGame.cells[2];
  let center = gameModel.newGame.cells[4];
  let bottomLeft = gameModel.newGame.cells[6];
  let bottomRight = gameModel.newGame.cells[8];

  if(topLeft === 'X' || topLeft === 'O'){
    if(topLeft === center && center === bottomRight){
      gameModel.winner = gameModel.currentPlayer;
      return true;
    }
  }

  if(topRight === 'X' || topRight === 'O'){
    if(topRight === center && center === bottomLeft){
      gameModel.winner = gameModel.currentPlayer;
      return true;
    }
  }

  return false;

};

// check the game
const checkGame = function(){
  let gameOver = false;

  let row0 = [0,1,2];
  let row1 = [3,4,5];
  let row2 = [6,7,8];
  let col0 = [0,3,6];
  let col1 = [1,4,7];
  let col2 = [2,5,8];

  if(
    checkSame(row0) === true ||
    checkSame(row1) === true ||
    checkSame(row2) === true ||
    checkSame(col0) === true ||
    checkSame(col1) === true ||
    checkSame(col2) === true ||
    checkDiags() === true ||
    gameModel.turnCount === gameModel.maxTurnCount
  ){
    gameOver = true;
  }

  // make sure everything is updated in the model after each check
  gameModel.newGame.over = gameOver;
  gameModel.gameOver = gameOver;

  return gameOver;
};

module.exports = {
  checkSame,
  checkDiags,
  checkGame,
};
