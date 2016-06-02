'use strict';

const app = require('../app.js');
const gameModel = require('../game/gameModel');

// create new user
const signUp = function(data){
  return $.ajax({
    url: app.host + '/sign-up/',
    method: 'POST',
    data: data
  });
};

// sign in
// note: `data: data` is the same as just `data` (it is implied)
const signIn = function(data){
  console.log('data is: ', data);

  return $.ajax({
    url: app.host + '/sign-in/',
    method: 'POST',
    data: data,
  });
};

// sign out
const signOut = function(){
  return $.ajax({
    url: app.host + '/sign-out/' + app.user.id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

// change password
const changePassword = function(data){

  console.log('change pw data: ', data);

  return $.ajax({
    url: app.host + '/change-password/' + app.user.id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
    data: data,
  });
};

// show game status
const show = function(gameId, authToken){
  return $.ajax({
    url: app.host + '/games/' + gameId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + authToken,
    },
  });
};

const play = function(gameId, authToken){
  return $.ajax({
    url: app.host + '/games/' + gameId,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + authToken,
    },
  });
};

const showGameInfo = function(){
  return $.ajax({
    url: app.host + '/games/' + gameModel.newGame.id,
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

// show all user games
const showGames = function(){
  return $.ajax({
    url: app.host + '/games',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

// create new game
const newGame = function(){
  return $.ajax({
    url: app.host + '/games',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
    data: '',
  });
};

// show all over user games
const showOverGames = function(){
  return $.ajax({
    url: app.host + '/games?over=true',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

// join game
const joinGame = function(gameId, authToken){

  console.log("gameId, authToken: ", gameId, authToken);

  return $.ajax({
    url: app.host + '/games/' + gameId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + authToken,
    },
    data: {},
  });
};

// update game on the back end with each move
const updateGame = function(data){
  let id = gameModel.newGame.id;

  console.log("data, id: ", data, id);
  console.log(typeof app.user.token);
  console.log(typeof gameModel.newGame.id);

  return $.ajax({
    url: app.host + '/games/' + id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
    data: data,
  });
};

// watch a game (streaming, requires wrapper)
const watchGame = function(gameId, authToken){
  let id = gameModel.newGame.id;

  console.log("watched id: ", id);

  return $.ajax({
    url: app.host + '/games/' + id + '/watch',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + authToken,
    },
  });
};

module.exports = {
  signUp,
  signIn,
  signOut,
  changePassword,
  newGame,
  showGames,
  showOverGames,
  joinGame,
  updateGame,
  showGameInfo,
  show,
  watchGame,
  play,
};
