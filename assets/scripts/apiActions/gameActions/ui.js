'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');
const gameMoves = require('../../game/gameMoves.js');
const gameChecks = require('../../game/gameChecks.js');
const games = require('../../game/games.js');
const gameWatcherMaker = require('../../watch/make-watcher.js');
const gameWatcherAttachHandler = require('../../watch/watcher-event-handlers.js');

const success = function(data){

  if(data){
    // console.log(data);
  }else{
    // console.log('GREAT SUCCESS!!!!!');
  }

  // redraw Board
  gameMoves.redrawBoard();

};

const failure = function(error){
  if(error !== undefined || error !== null){
    // console.error(error);
  }
};

const showBoard = function(){
  $('.signed-in-view').show();
};

const hideBoard = function(){
  $('.table-section').hide();
  $('.signed-in-view').hide();
};

const updateView = function(){
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);
  gameMoves.refreshCounts();
  gameMoves.refreshGameInfoTable(gameModel.newGame);
  gameMoves.redrawBoard();
  gameModel.gameOver = gameChecks.checkGame(gameModel.newGame);
  gameModel.newGame.over = gameChecks.checkGame(gameModel.newGame);
  gameMoves.updatePlayerTurnAnnouncement();

  // show modal if game over
  if(gameModel.gameOver === true){
    $('#game-update-modal').text(gameModel.winnerString);
    $('#gameUpdateModal').modal('show');
  }

};

const successMove = function(){
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
    gameMoves.refreshCounts();
    gameModel.updateGameType(gameModel.newGame);
    gameMoves.refreshGameInfoTable(gameModel.newGame);
  }
};

const updateGames = function(data){

  // set objects
  if(data !== undefined && data.games !== undefined){
    app.games = data.games;
    $('#stats-player-id').text(app.user.id);
    $('#stats-games').text(app.games.length);
    $('#stats-finished-games').text(app.finished_games.length);
  }
};

const updateFinishedGames = function(data){

    // set objects
    if(data !== undefined && data.games !== undefined){
      app.finished_games = data.games;
      $('#stats-player-id').text(app.user.id);
      $('#stats-games').text(app.games.length);
      $('#stats-finished-games').text(app.finished_games.length);
    }
  };

const successShowGameInfo = function(data){
  let gameObject = data.game;
  gameMoves.refreshGameInfoTable(gameObject);
  gameMoves.redrawBoard();
  gameMoves.refreshCounts();
};

const successJoin = function(data){

  gameModel.newGame = data.game;

  //
  // reset game model variables
  //

  // turns gone for each player and total
  gameMoves.refreshCounts();

  $('.table-section').hide();
  $('.signed-in-view').hide();
  $('.game-over-section').hide();
  $('#gameUpdateModal').modal('hide');

  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  gameModel.activeGame = true;

  gameModel.newWatcher = gameWatcherMaker.gameWatcher(gameModel.newGame.id, app.user.token);
  gameWatcherAttachHandler.addHandlers(gameModel.newWatcher);

  // set yourself as player_o
  gameModel.currentPlayer = gameModel.players.players[1];
  gameModel.otherPlayer = gameModel.players.players[0];
  gameModel.currentSymbol = gameModel.players.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.players.symbols[gameModel.otherPlayer];
  gameMoves.onGameCheck(gameModel.newGame);

  // redraw Board
  gameMoves.redrawBoard();

  // show game info
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
    gameMoves.refreshGameInfoTable(gameModel.newGame);
  }

  // update player announcement
  gameMoves.updatePlayerTurnAnnouncement();

  // reset view
  $('.table-section').show();
  $('.signed-in-view').show();
  $('.not-signed-in').hide();

};

const successPlayThisGame = function(data){
  gameModel.newGame = data.game;

  // show game info
  if(gameModel.newGame.id !== null){
    gameMoves.refreshGameInfoTable(gameModel.newGame);
    gameMoves.refreshCounts();
  }
};

const newGame = function(data){

  // instantiate new game
  gameModel.newGame = new games.game(data.game);

  // check game type
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  // should be zero
  gameMoves.refreshCounts();

  // reset some game vars
  gameModel.turnCount = 0;
  gameModel.winner = null;
  gameModel.winnerString = '';
  gameModel.playerJoined = false;

  $('.table-section').hide();
  $('.signed-in-view').hide();
  $('.game-over-section').hide();
  $('#gameUpdateModal').modal('hide');

  // reset gameOver and activeGame
  gameModel.gameOver = gameModel.newGame.over;
  gameModel.activeGame = true;

  // set initial params
  gameModel.currentPlayer = gameModel.players.players[0];
  gameModel.otherPlayer = gameModel.players.players[1];
  gameModel.currentSymbol = gameModel.players.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.players.symbols[gameModel.otherPlayer];

  // display status
  if(gameModel.gameType === games.gameTypes[0]){
    $('#player-turn').text(gameModel.currentPlayer + "'s Turn!");
  } else {
    $('#player-turn').text(gameModel.currentPlayer);
  }

  // watch for updates
  $('#game-to-watch').val(gameModel.newGame.id);
  $('#watch-game').submit();

  // reset view
  $('.table-section').show();
  $('.signed-in-view').show();
  $('.not-signed-in').hide();
};

module.exports = {
  success,
  failure,
  showBoard,
  hideBoard,
  updateView,
  successMove,
  updateGames,
  updateFinishedGames,
  successShowGameInfo,
  successJoin,
  successPlayThisGame,
  newGame,
};
