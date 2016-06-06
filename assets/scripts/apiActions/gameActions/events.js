'use strict';

const api = require('./api.js');
const ui = require('./ui.js');
const gameModel = require('../../game/gameModel.js');
const gameMoves = require('../../game/gameMoves.js');
const games = require('../../game/games.js');

const onNewGame = function(event){
  event.preventDefault();

  $('#selectGameTypeModal').modal('show');

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
  $('#selectGameToJoinModal').modal('hide');
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

  gameMoves.updatePlayerTurnAnnouncement();
  $('#selectGameTypeModal').modal('hide');

  if(gameModel.gameType === games.gameTypes[1]){
    $('#waitingForPlayerModal').modal('show');
  }
};

const onCancelGame = function(event) {
  event.preventDefault();

  gameModel.currentPlayer = gameModel.players.players[0];
  gameModel.otherPlayer = gameModel.players.players[1];
  gameModel.currentSymbol = gameModel.players.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.players.symbols[gameModel.otherPlayer];

  gameModel.activeGame = false;
  gameModel.gameOver = false;

  gameModel.turnCount = 0;
  gameModel.xCount = 0;
  gameModel.oCount = 0;

  gameModel.winner = null;
  gameModel.winnerString = '';

  gameModel.newWatcher = null;

  gameModel.gameType = games.gameTypes[0];
  gameModel.botGame = false;

  gameModel.playerJoined = false;

  gameModel.newGame = {
    id: null,
    cells: null,
    over: null,
    player_x: null,
    player_o: null,
  };

  gameModel.boardDict = {
    'cell-00': '',
    'cell-01': '',
    'cell-02': '',
    'cell-10': '',
    'cell-11': '',
    'cell-12': '',
    'cell-20': '',
    'cell-21': '',
    'cell-22': '',
  };

  gameMoves.updatePlayerTurnAnnouncement();
  gameMoves.redrawBoard();
  gameMoves.refreshGameInfoTable(gameModel.newGame);
  gameMoves.clearGameInfoTable();
  $('#waitingForPlayerModal').modal('hide');
};

const onSwitchGameType = function(event) {
  event.preventDefault();
  gameModel.gameType = games.gameTypes[0];
  $('#waitingForPlayerModal').modal('hide');
};

const onStartAnotherGame = function(event) {
  event.preventDefault();
  $('#gameUpdateModal').modal('hide');
  onNewGame.submit();
};

const onJoinGameModal = function() {
  $('#selectGameToJoinModal').modal('show');
};

const onShowAnyGameInfoModal = function() {
  $('#anyGameInfoModal').modal('show');
};

const onJoinAnyGameModal = function() {
  $('#joinAnyGameModal').modal('show');
};

const onExitGame = function() {

  gameModel.currentPlayer = gameModel.players.players[0];
  gameModel.otherPlayer = gameModel.players.players[1];
  gameModel.currentSymbol = gameModel.players.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.players.symbols[gameModel.otherPlayer];

  gameModel.activeGame = false;
  gameModel.gameOver = false;

  gameModel.turnCount = 0;
  gameModel.xCount = 0;
  gameModel.oCount = 0;

  gameModel.winner = null;
  gameModel.winnerString = '';

  gameModel.newWatcher = null;

  gameModel.gameType = games.gameTypes[0];
  gameModel.botGame = false;

  gameModel.playerJoined = false;

  gameModel.newGame = {
    id: null,
    cells: null,
    over: null,
    player_x: null,
    player_o: null,
  };

  gameModel.boardDict = {
    'cell-00': '',
    'cell-01': '',
    'cell-02': '',
    'cell-10': '',
    'cell-11': '',
    'cell-12': '',
    'cell-20': '',
    'cell-21': '',
    'cell-22': '',
  };

  gameMoves.updatePlayerTurnAnnouncement();
  gameMoves.redrawBoard();
  gameMoves.refreshGameInfoTable(gameModel.newGame);
  gameMoves.clearGameInfoTable();
};

const addHandlers = () => {

  $('#new-game').on('click', onNewGame);
  $('#show-any-game-info-modal').on('click', onShowAnyGameInfoModal);
  $('#play-this-game-modal').on('click', onJoinAnyGameModal);
  $('#join-game-modal').on('click', onJoinGameModal);
  $('#exit-game').on('click', onExitGame);

  $('#show-this-game-info').on('submit', onShowGameInfo);
  $('#show-any-game-info').on('submit', onShowAnyGameInfo);
  $('#play-this-game').on('submit', onPlayThisGame);

  $('#select-game-type').on('submit', onSelectGameType);
  $('#get-games').on('submit', onGetGames);
  $('#get-done-games').on('submit', onGetDoneGames);
  $('#join-game').on('submit', onJoinGame);
  $('#start-another-game').on('submit', onNewGame);
  $('#cancel-game').on('submit', onCancelGame);
  $('#switch-to-single-player').on('submit', onSwitchGameType);
  $('#start-another-game').on('submit', onStartAnotherGame);

};

module.exports = {
  addHandlers,
};
