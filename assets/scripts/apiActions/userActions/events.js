'use strict';

const app = require('../../app.js');
const getFormFields = require('../../../../lib/get-form-fields.js');
const api = require('./api.js');
const ui = require('./ui.js');
const gameUi = require('../gameActions/ui.js');
const gameModel = require('../../game/gameModel.js');

const onSignUp = function(event){
  event.preventDefault();
  gameModel.activeGame = false;

  let data = getFormFields(event.target);
  api.signUp(data)
  .done(ui.success)
  .then(ui.signUpSuccess)
  .fail(ui.failure);
};

const onSignIn = function(event){
  event.preventDefault();
  gameModel.activeGame = false;

  let data = getFormFields(event.target);
  api.signIn(data)
  .done(ui.signInSuccess)
  .then(gameUi.showBoard)
  .fail(ui.failure);
};

const onSignOut = function(event){
  event.preventDefault();
  gameModel.activeGame = false;

  api.signOut()
  .done(ui.success)
  .then(ui.signOutSuccess)
  .fail(ui.failure);
};

const onChangePassword = function(event){
  event.preventDefault();
  let data = getFormFields(event.target);

  api.changePassword(data)
  .done(ui.changePasswordSuccess)
  .then(ui.success)
  .then(gameUi.showBoard)
  .fail(ui.failure);

};

const onShowTokenModal = function(){
  event.preventDefault();
  $('#auth-token-p').text(app.user.token);
  $('#tokenModal').modal('show');
};

const onShowPlayerStatsModal = function() {
  event.preventDefault();
  $('#get-games').submit();
  $('#get-done-games').submit();

  $('#playerStatsModal').modal('show');
};

const addHandlers = () => {

  //
  //buttons
  //

  $('#sign-up').on('submit', onSignUp);
  $('#sign-in').on('submit', onSignIn);
  $('#change-password').on('submit', onChangePassword);

  // note click since not in a form
  $('#sign-out').on('click', onSignOut);
  $('#show-token-modal').on('click', onShowTokenModal);
  $('#show-player-stats-modal').on('click', onShowPlayerStatsModal);

};

module.exports = {
  addHandlers,
};
