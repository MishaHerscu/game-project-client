'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');
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

  // show game info
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
    gameModel.refreshGameInfoTable(gameModel.newGame);
  }

  // redraw Board
  gameMoves.redrawBoard();
};

const successShow = function(data){
  let gameObject = data.game;
  gameModel.newGame = data.game;
  gameMoves.refreshGameInfoTable(gameObject);
  gameMoves.redrawBoard();
};

module.exports = {
  success,
  failure,
  successWatch,
  successShow,
};
