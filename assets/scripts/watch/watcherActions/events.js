'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');
const gameWatcherMaker = require('../make-watcher.js');
const gameWatcherAttachHandler = require('../watcher-event-handlers.js');

const onWatchGame = function(event){
  event.preventDefault();

  // game to watch
  let gameId = $('#game-to-watch').val();

  // make watcher
  let watcher = gameWatcherMaker.gameWatcher(gameId, app.user.token);

  // attach handlers to watcher
  gameWatcherAttachHandler.addHandlers(watcher);

};

const addHandlers = () => {

  $('#watch-game').on('submit', onWatchGame);

};

module.exports = {
  addHandlers,
};
