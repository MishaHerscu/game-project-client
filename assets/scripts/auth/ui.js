'use strict';

const app = require('../app.js');
const gameLogic = require('../game/gameLogic.js');
const games = require('../game/games.js');

const success = function(data){
  if(data){
    console.log(data);
  }else{
    console.log('GREAT SUCCESS!!!!!');
  }
};

const signUpSuccess = function(){
  $('#sign-in-email').val($('#sign-up-email').val());
  $('#sign-in-pw').val($('#sign-up-pw').val());
  $('#sign-in').submit();
  $('#signUpModal').modal('hide');

};

const failure = function(error){
  console.error(error);
};

const signInSuccess = function(data){
  app.user = data.user;
  $('.not-signed-in').hide();
  $('#auth-token-td').text(app.user.token);
  $('#any-game-auth').val(app.user.token);
  $('#game-to-play-auth').val(app.user.token);
  $('#signInModal').modal('hide');
  $('#gameUpdateModal').modal('hide');

  console.log('app: ', app);
};

const signOutSuccess = function(){
  app.user = null;
  console.log('app: ', app);
  $('.not-signed-in').show();
  $('.table-section').hide();
  $('.hideable').hide();
  $('#signInModal').modal('hide');
  $('#signUpModal').modal('hide');
  $('#gameUpdateModal').modal('hide');
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

const successPlayThisGame = function(data){
  let gameObject = data.game;
  console.log(gameObject);
  gameLogic.newGame = gameObject;
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
  $('#game-update-modal').text(gameLogic.currentPlayer + "'s Turn!");

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
  successPlayThisGame,
  signUpSuccess,
};
