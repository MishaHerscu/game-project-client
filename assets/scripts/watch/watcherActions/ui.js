'use strict';

const app = require('../../app.js');
const gameModel = require('../../../game/gameModel.js');
const gameWatcherMaker = require('../make-watcher.js');
const gameWatcherAttachHandler = require('../watcher-event-handlers.js');

const success = function(data){
  if(data){
    console.log(data);
  }else{
    console.log('GREAT SUCCESS!!!!!');
  }
};

const failure = function(error){
  console.error(error);
};

const successWatch = function(data){
  gameModel.newGame = data.game;
  $('#show-this-game-info').submit();
  gameModel.activeGame = true;
  gameModel.gameOver = gameModel.newGame.over;

  let newWatcher = gameWatcherMaker.gameWatcher(gameModel.watchGame.id, app.user.token);
  gameWatcherAttachHandler.addHandlers(newWatcher);
};

module.exports = {
  success,
  failure,
  successWatch,
};
