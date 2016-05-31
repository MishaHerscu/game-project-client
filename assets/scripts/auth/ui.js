'use strict';

const app = require('../app.js');
const gameLogic = require('../game/gameLogic.js');
const games = require('../game/games.js');

const success = (data) => {
  if(data){
    console.log(data);
  }else{
    console.log('GREAT SUCCESS!!!!!');
  }
};

const failure = (error) => {
  console.error(error);
};

const signInSuccess = function(data){
  app.user = data.user;
  $('.not-signed-in').hide();
  console.log('app: ', app);
};

const signOutSuccess = function(){
  app.user = null;
  console.log('app: ', app);
  $('.not-signed-in').show();
  $('.table-section').hide();
  $('.hideable').hide();
};

const showBoard = function(){
  $('.hideable').show();
};

const hideBoard = function(){
  $('.table-section').hide();
  $('.hideable').hide();
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

const successShowGameInfo = function(){
  $("#game-id-data").text(gameLogic.newGame.id);
  $("#game-cells-data").text(gameLogic.newGame.cells);
  $("#game-over-data").text(gameLogic.newGame.over);
  $("#player-x-data").text(gameLogic.players[0]);
  $("#player-o-data").text(gameLogic.players[1]);
};

const newGame = function(data){

  // data about new game
  let gameData = data.game;
  gameLogic.turnCount = 0;
  gameLogic.winner = null;
  gameLogic.winnerString = '';

  $('.table-section').hide();
  $('.hideable').hide();
  $('.game-over-section').hide();

  // instantiate new game
  gameLogic.newGame = new games.game(gameData);

  gameLogic.gameOver = gameLogic.newGame.over;
  gameLogic.activeGame = true;
  // gameLogic.currentPlayer = gameLogic.newGame.player_x;
  // gameLogic.otherPlayer = gameLogic.newGame.player_o;
  gameLogic.currentPlayer = gameLogic.players[0];
  gameLogic.otherPlayer = gameLogic.players[1];
  gameLogic.currentSymbol = gameLogic.symbols[gameLogic.currentPlayer];
  gameLogic.otherSymbol = gameLogic.symbols[gameLogic.otherPlayer];

  $('#player-turn').text(gameLogic.currentPlayer + "'s Turn!");
  $('.cell').text('');

  gameLogic.updateGameInfo();

  $('.table-section').show();
  $('.hideable').show();
  $('.not-signed-in').hide();

};

module.exports = {
  failure,
  success,
  signInSuccess,
  signOutSuccess,
  showBoard,
  hideBoard,
  updateGames,
  updateFinishedGames,
  successShowGameInfo,
  newGame,
};
