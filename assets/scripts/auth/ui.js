'use strict';

const app = require('../app.js');
const gameModel = require('../game/gameModel.js');
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

const changePasswordSuccess = function(){
  $('#changePWModal').modal('hide');
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
  gameModel.newGame = gameObject;
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

  gameModel.gameOver = gameModel.newGame.over;
  gameModel.activeGame = true;
  // gameModel.currentPlayer = gameModel.newGame.player_x;
  // gameModel.otherPlayer = gameModel.newGame.player_o;
  gameModel.currentPlayer = gameModel.players[0];
  gameModel.otherPlayer = gameModel.players[1];
  gameModel.currentSymbol = gameModel.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.symbols[gameModel.otherPlayer];

  $('#player-turn').text(gameModel.currentPlayer + "'s Turn!");
  $('#game-update-modal').text(gameModel.currentPlayer + "'s Turn!");

  $('.cell').text('');

  gameModel.updateGameInfo();

  $('.table-section').show();
  $('.hideable').show();
  $('.not-signed-in').hide();

};

module.exports = {
  failure,
  success,
  signInSuccess,
  changePasswordSuccess,
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
