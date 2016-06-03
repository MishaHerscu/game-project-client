'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');
const gameMoves = require('../../game/gameMoves.js');
const games = require('../../game/games.js');
const gameWatcherMaker = require('../../watch/make-watcher.js');
const gameWatcherAttachHandler = require('../../watch/watcher-event-handlers.js');

const success = function(data){
  if(data){
    console.log(data);
  }else{
    console.log('GREAT SUCCESS!!!!!');
  }

  // redraw Board
  gameMoves.redrawBoard();

};

const failure = function(error){
  console.error(error);
};

const showBoard = function(){
  $('.hideable').show();
};

const hideBoard = function(){
  $('.table-section').hide();
  $('.hideable').hide();
};

const updateView = function(){

  // update grid
  gameMoves.redrawBoard();

  // update game info
  gameMoves.refreshGameInfoTable(gameModel.newGame);

};

const successMove = function(){
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
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
  console.log(gameObject);
  gameMoves.refreshGameInfoTable(gameObject);

  // redraw Board
  gameMoves.redrawBoard();
};

const successJoin = function(data){
  gameModel.newGame = data.game;

  gameModel.activeGame = true;

  gameModel.newWatcher = gameWatcherMaker.gameWatcher(gameModel.newGame.id, app.user.token);
  gameWatcherAttachHandler.addHandlers(gameModel.newWatcher);

  // redraw Board
  gameMoves.redrawBoard();

  // show game info
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
    gameMoves.refreshGameInfoTable(gameModel.newGame);
  }

};

const successPlayThisGame = function(data){
  gameModel.newGame = data.game;

  // show game info
  if(gameModel.newGame.id !== null){
    gameMoves.refreshGameInfoTable(gameModel.newGame);
  }
};

const newGame = function(data){

  // data about new game
  let gameObject = data.game;
  gameModel.turnCount = 0;
  gameModel.winner = null;
  gameModel.winnerString = '';

  $('.table-section').hide();
  $('.hideable').hide();
  $('.game-over-section').hide();
  $('#gameUpdateModal').modal('hide');

  // instantiate new game
  gameModel.newGame = new games.game(gameObject);
  console.log(gameModel.newGame);

  // reset gameOver and activeGame
  gameModel.gameOver = gameModel.newGame.over;
  gameModel.activeGame = true;

  // set initial params
  if(gameModel.newGame.player_x !== null && gameModel.newGame.player_x !== undefined){
    gameModel.currentPlayer = gameModel.newGame.player_x;
  }else{
    gameModel.currentPlayer = gameModel.players[0];
  }

  if(gameModel.newGame.player_o !== null && gameModel.newGame.player_o !== undefined){
    gameModel.currentPlayer = gameModel.newGame.player_0;
  }else{
    gameModel.currentPlayer = gameModel.players[1];
  }

  gameModel.currentSymbol = gameModel.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.symbols[gameModel.otherPlayer];

  // display status
  $('#player-turn').text(gameModel.currentPlayer + "'s Turn!");
  $('#game-update-modal').text(gameModel.currentPlayer + "'s Turn!");

  // watch for updates
  $('#game-to-watch').val(gameModel.newGame.id);
  $('#watch-game').submit();

  // reset view
  $('.table-section').show();
  $('.hideable').show();
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
