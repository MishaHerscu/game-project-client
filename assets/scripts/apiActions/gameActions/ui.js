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
  gameMoves.refreshGameInfoTable(gameObject);
  gameMoves.redrawBoard();
};

const successJoin = function(data){

  gameModel.newGame = data.game;

  //
  // reset game model variables
  //

  // turns gone for each player and total
  gameMoves.refreshCounts();

  $('.table-section').hide();
  $('.hideable').hide();
  $('.game-over-section').hide();
  $('#gameUpdateModal').modal('hide');

  gameModel.updateGameType(gameModel.newGame);

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

  // display status
  $('#player-turn').text(gameModel.currentPlayer + "'s Turn!");
  $('#game-update-modal').text(gameModel.currentPlayer + "'s Turn!");

  // reset view
  $('.table-section').show();
  $('.hideable').show();
  $('.not-signed-in').hide();

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

  // reset gameOver and activeGame
  gameModel.gameOver = gameModel.newGame.over;
  gameModel.activeGame = true;

  // set initial params
  gameModel.currentPlayer = gameModel.players.players[0];
  gameModel.otherPlayer = gameModel.players.players[1];
  gameModel.currentSymbol = gameModel.players.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.players.symbols[gameModel.otherPlayer];

  // check game type
  gameModel.updateGameType(gameModel.newGame);

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
