'use strict';

const gameModel = require('./gameModel');
const gameApi = require('../apiActions/gameActions/api');
const gameUi = require('../apiActions/gameActions/ui');


const checkCellEmpty = function(val){
  if(val !== ""){
    console.log('Sorry! Someone already went there.');
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
      "over": gameModel.gameOver
    }
  };
  console.log('updateGameData: ', updateGameData);

  // update game in the back end
  gameApi.updateGame(updateGameData)
  .done(gameUi.successMove)
  .fail(gameUi.failure);

  console.log('updated game object: ', gameModel.newGame);
};

module.exports = {
  checkCellEmpty,
  updateModelValues,
  updateAPI,
};
