'use strict';

const app = require('../../app.js');
const gameModel = require('../../../game/gameModel.js');
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

  // show game info
  if(gameModel.newGame.id !== null){
    gameModel.refreshGameInfoTable(gameModel.newGame);
  }

  gameModel.activeGame = true;
  gameModel.gameOver = gameModel.newGame.over;

  let newWatcher = gameWatcherMaker.gameWatcher(gameModel.watchGame.id, app.user.token);
  gameWatcherAttachHandler.addHandlers(newWatcher);

  // redraw Board
  gameMoves.redrawBoard();

  // show game info
  if(gameModel.newGame.id !== null){
    gameMoves.refreshGameInfoTable(gameModel.newGame);
  }

};

module.exports = {
  success,
  failure,
  successWatch,
};
