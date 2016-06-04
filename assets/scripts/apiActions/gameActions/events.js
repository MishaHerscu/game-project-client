'use strict';

const api = require('./api.js');
const ui = require('./ui.js');
const gameModel = require('../../game/gameModel.js');
const games = require('../../game/games.js');

const onNewGame = function(event){
  event.preventDefault();

  $('#SelectGameTypeModal').modal('show');

  api.newGame()
  .done(ui.success)
  .then(ui.newGame)
  .then(ui.showBoard)
  .then(ui.updateView)
  .fail(ui.failure);

};

const onGetGames = function(event){
  event.preventDefault();

  api.showGames()
  .done(ui.success)
  .then(ui.updateGames)
  .fail(ui.failure);

};

const onGetDoneGames = function(event){
  event.preventDefault();

  api.showOverGames()
  .done(ui.success)
  .then(ui.updateFinishedGames)
  .fail(ui.failure);

};

const onJoinGame = function(event){
  event.preventDefault();
  let gameId = $('#game-to-join').val();

  api.joinGame(gameId)
  .done(ui.success)
  .then(ui.successJoin)
  .fail(ui.failure);
};

const onShowGameInfo = function(event){
  event.preventDefault();

  if(gameModel.newGame.id === null){
    return false;
  }else{
    api.showGameInfo()
    .done(ui.successShowGameInfo)
    .fail(ui.failure);
  }
};

const onShowAnyGameInfo = function(event){
  event.preventDefault();
  let gameId = $('#any-game-id').val();
  let authToken = $('#any-game-auth').val();

  api.show(gameId, authToken)
  .done(ui.successShowGameInfo)
  .fail(ui.failure);
};

const onPlayThisGame = function(event){
  event.preventDefault();
  let gameId = $('#game-to-play-id').val();
  let authToken = $('#game-to-play-auth').val();

  api.play(gameId, authToken)
  .done(ui.successPlayThisGame)
  .fail(ui.failure);
};

const onSelectGameType = function(event) {
  event.preventDefault();
  let gameTypeSelection = $("input[type='radio'][name='gametype']:checked").val();
  gameModel.gameType = games.gameTypes[gameTypeSelection];
  $('#SelectGameTypeModal').modal('hide');
};

const addHandlers = () => {

  $('#new-game').on('submit', onNewGame);
  $('#select-game-type').on('submit', onSelectGameType);
  $('#get-games').on('submit', onGetGames);
  $('#get-done-games').on('submit', onGetDoneGames);
  $('#join-game').on('submit', onJoinGame);
  $('#show-this-game-info').on('submit', onShowGameInfo);
  $('#show-any-game-info').on('submit', onShowAnyGameInfo);
  $('#play-this-game').on('submit', onPlayThisGame);
  $('#start-another-game').on('submit', onNewGame);

};

module.exports = {
  addHandlers,
};
