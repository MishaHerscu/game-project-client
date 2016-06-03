'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');
const gameChecks = require('../../game/gameChecks.js');
const gameWatcherMaker = require('../make-watcher.js');
const gameWatcherAttachHandler = require('../watcher-event-handlers.js');
const gameMoves = require('../../game/gameMoves.js');

const success = function(data){
  if(data){
    console.log(data);
  }else{
    console.log('GREAT SUCCESS!!!!!');
  }

  // redraw Board
  gameMoves.redrawBoard();

};

const failure = function(error){
  console.error(error);
};

const successWatch = function(data){

  gameModel.newGame = data.game;
  gameModel.activeGame = true;
  gameModel.gameOver = gameModel.newGame.over;
  gameModel.newWatcher = gameWatcherMaker.gameWatcher(gameModel.newGame.id, app.user.token);
  gameWatcherAttachHandler.addHandlers(gameModel.newWatcher);
  gameMoves.refreshCounts();

  // show game info
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
    gameModel.refreshGameInfoTable(gameModel.newGame);
  }

  gameMoves.redrawBoard();
};

const updateModel = function(data){
  gameModel.newGame = data.game;
};

const updateView = function(){
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);
  gameMoves.refreshCounts();
  gameMoves.refreshGameInfoTable(gameModel.newGame);
  gameMoves.redrawBoard();
  gameChecks.checkGame();
};

module.exports = {
  success,
  failure,
  successWatch,
  updateView,
  updateModel,
};
