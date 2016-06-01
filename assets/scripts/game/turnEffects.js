'use strict';

const gameLogic = require('./gameLogic');
const api = require('../auth/api');

const checkCellEmpty = function(val){
  if(val !== ""){
    console.log('Sorry! Someone already went there.');
    return false;
  } else {
    return true;
  }
};

const updateModelValues = function(currentSymbol, clickedCell){
  gameLogic.boardDict[clickedCell] = currentSymbol;
  let modelGameIndex = gameLogic.boardTrans.indexOf(clickedCell);
  gameLogic.newGame.cells[modelGameIndex] = currentSymbol;
  return modelGameIndex;
};

const updateAPI = function(modelGameIndex,currentSymbol){
  let updateGameData = {
    "game": {
      "cell": {
        "index": modelGameIndex,
        "value": currentSymbol
      },
      "over": gameLogic.gameOver
    }
  };
  console.log('updateGameData: ', updateGameData);

  // update game in the back end
  api.updateGame(updateGameData);
  console.log('updated game object: ', gameLogic.newGame);
};

module.exports = {
  checkCellEmpty,
  updateModelValues,
  updateAPI,
};
