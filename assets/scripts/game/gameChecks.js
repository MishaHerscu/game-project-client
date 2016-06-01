'use strict';

// imports
const gameLogic = require('./gameLogic.js');

// check whether dict values are the same
// the keys have to be 0, 1, 2 etc.
// this is based on matching the format we get from jQuery
const checkSame = function(dict){
  let checkVal = $(dict[0]).text();

  if(checkVal === ""){

    return false;

  }else{

    for(let i = 0, max = gameLogic.gameSize; i < max; i++){
      if($(dict[i]).text() !== checkVal){
        return false;
      }
    }
  }
  return true;
};

// check diagonal win conditions
const checkDiags = function(){

  // define vars
  let topLeft = gameLogic.newGame.cells[0];
  let topRight = gameLogic.newGame.cells[2];
  let center = gameLogic.newGame.cells[4];
  let bottomLeft = gameLogic.newGame.cells[6];
  let bottomRight = gameLogic.newGame.cells[8];

  if(topLeft === 'X' || topLeft === 'O'){
    if(topLeft === center && center === bottomRight){
      return true;
    }
  }

  if(topRight === 'X' || topRight === 'O'){
    if(topRight === center && center === bottomLeft){
      return true;
    }
  }

  return false;

};

// check the game
const checkGame = function(){
  let gameOver = false;
  if(
    checkSame($(".row-0")) === true ||
    checkSame($(".col-0")) === true ||
    checkSame($(".row-1")) === true ||
    checkSame($(".col-1")) === true ||
    checkSame($(".row-2")) === true ||
    checkSame($(".col-2")) === true ||
    checkDiags() === true ||
    gameLogic.turnCount === gameLogic.maxTurnCount
  ){
    gameOver = true;
  }

  console.log('gameOver: ', gameOver);
  return gameOver;
};

module.exports = {
  checkSame,
  checkDiags,
  checkGame,
};
