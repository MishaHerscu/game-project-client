'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');
const gameWatcherMaker = require('../make-watcher.js');
const gameWatcherAttachHandler = require('../watcher-event-handlers.js');

const onWatchGame = function(event){
  event.preventDefault();
  let gameId = $('#game-to-watch').val();
  let watcher = gameWatcherMaker.gameWatcher(gameId, app.user.token);
  gameModel.watchGame = watcher.game;
  gameWatcherAttachHandler.addHandlers(watcher);
  return watcher;
};

const addHandlers = () => {

  $('#watch-game').on('submit', onWatchGame);

};

module.exports = {
  addHandlers,
};
