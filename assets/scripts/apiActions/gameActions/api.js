'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel.js');

// show game status
const show = function(gameId, authToken){
  console.log('show happening');
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

  console.log('inside showGameInfo');

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
const joinGame = function(gameId){

  return $.ajax({
    url: app.host + '/games/' + gameId,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + app.user.token,
    },
  });
};

// update game on the back end with each move
const updateGame = function(data){
  let id = gameModel.newGame.id;
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
  return $.ajax({
    url: app.host + '/games/' + id + '/watch',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + authToken,
    },
  });
};

module.exports = {
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
