'use strict';

const onChange = function(data){
  if (data.timeout) { //not an error
    $('#game-watcher').close();
    return console.warn(data.timeout);
  } else if (data.game && data.game.cell) {
    let game = data.game;
    let cell = game.cell;
    $('#watch-index').val(cell.index);
    $('#watch-value').val(cell.value);
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