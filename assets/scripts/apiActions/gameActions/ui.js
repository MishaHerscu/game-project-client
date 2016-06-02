'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');
const games = require('../../game/games.js');
const gameWatcherMaker = require('../../watch/make-watcher.js');
const gameWatcherAttachHandler = require('../../watch/watcher-event-handlers.js');

const success = function(data){
  if(data){
    console.log(data);
  }else{
    console.log('GREAT SUCCESS!!!!!');
  }
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

const successMove = function(){
  $('#show-this-game-info').submit();
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
  $("#game-id-data").text(gameObject.id);
  $("#game-cells-data").text(gameObject.cells);
  $("#game-over-data").text(gameObject.over);

  if(gameObject.player_x === null){
    $("#player-x-data").text("N/A");
  }else{
    $("#player-x-data").text(gameObject.player_x.email);
  }
  if(gameObject.player_o === null){
    $("#player-o-data").text("N/A");
  }else{
    $("#player-o-data").text(gameObject.player_o.email);
  }
};

const successJoin = function(data){
  gameModel.newGame = data.game;
  $('#show-this-game-info').submit();

  gameModel.activeGame = true;

  let newWatcher = gameWatcherMaker.gameWatcher(gameModel.newGame.id, app.user.token);
  gameWatcherAttachHandler.addHandlers(newWatcher);
};

const successPlayThisGame = function(data){
  gameModel.newGame = data.game;
};

const newGame = function(data){

  // data about new game
  let gameData = data.game;
  gameModel.turnCount = 0;
  gameModel.winner = null;
  gameModel.winnerString = '';

  $('.table-section').hide();
  $('.hideable').hide();
  $('.game-over-section').hide();
  $('#gameUpdateModal').modal('hide');

  // instantiate new game
  gameModel.newGame = new games.game(gameData);

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

  // update grid
  for(let i = 0, max = gameModel.newGame.cells.length; i < max; i++){
    gameModel.boardDict[gameModel.boardTrans[i]] = gameModel.newGame.cells[i];
  }

  // update game info
  gameModel.updateGameInfo();

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
  successMove,
  updateGames,
  updateFinishedGames,
  successShowGameInfo,
  successJoin,
  successPlayThisGame,
  newGame,
};
