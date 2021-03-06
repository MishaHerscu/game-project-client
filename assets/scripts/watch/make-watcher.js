'use strict';

const watcherMaker = require('./resource-watcher-0.1.0.js');
const app = require('../app.js');

const gameWatcher = function(id, authToken){

  let gameWatcherObject = watcherMaker.resourceWatcher(app.host + '/games/' + id + '/watch', {
      Authorization: 'Token token=' + authToken,
      timeout: 30,
    });

    return gameWatcherObject;
};

module.exports = {
  gameWatcher,
};
