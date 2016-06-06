'use strict';

const app = require('../app.js');
const ui = require('./watcherActions/ui.js');
const gameModel = require('../game/gameModel.js');
const gameApi = require('../apiActions/gameActions/api.js');

const onChange = function(data){

  if (data.timeout) { //not an error

    if(this !== undefined && this !== null){
      this.close();
    }

    if(gameModel.newWatcher !== undefined && gameModel.newWatcher !== null){
      gameModel.newWatcher.close();
    }

    return console.warn(data.timeout);

  } else if (data.game && data.game.cell) {
    let game = data.game;
    let cell = game.cell;
    // $('#watch-index').val(cell.index);
    // $('#watch-value').val(cell.value);

    gameModel.newGame.cells[cell.index] = cell.value;

    gameModel.playerJoined = true;
    $('#waitingForPlayerModal').modal('hide');
    $('#show-this-game-info').submit();

    // refresh all data, to get new user info
    gameApi.show(gameModel.newGame.id, app.user.token)
    .done(ui.updateModel)
    .then(ui.updateView)
    .fail(ui.failure);

  } else if(data.game !== null && data.game !== undefined){
    gameModel.playerJoined = true;
    $('#waitingForPlayerModal').modal('hide');
    $('#show-this-game-info').submit();    

  } else{
    // console.log(data);
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
