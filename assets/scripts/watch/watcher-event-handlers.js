'use strict';

const app = require('../app.js');
const ui = require('./watcherActions/ui.js');
const gameMoves = require('../game/gameMoves.js');
const gameModel = require('../game/gameModel.js');
const gameApi = require('../apiActions/gameActions/api.js');

const onChange = function(data){
  if (data.timeout) { //not an error
    this.close();
    return console.warn(data.timeout);
  } else if (data.game && data.game.cell) {
    let game = data.game;
    let cell = game.cell;
    // $('#watch-index').val(cell.index);
    // $('#watch-value').val(cell.value);

    gameModel.newGame.cells[cell.index] = cell.value;

    // refresh all data, to get user info
    gameApi.show(data.game.id, app.user.token)
    .done(ui.successShow)
    .fail(ui.failure);

    // redraw Board
    gameMoves.redrawBoard();

    // show game info
    if(gameModel.newGame.id !== null){
      gameMoves.refreshGameInfoTable(gameModel.newGame);
    }

  } else {
    console.log(data);
  }
};

const onError = function(event){
  console.error('an error has occurred with the stream', event);
};

const addHandlers = (newWatcher) => {

  newWatcher.on('change', onChange);
  newWatcher.on('error', onError);

};

module.exports = {
  addHandlers,
};
