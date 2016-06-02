'use strict';

const getFormFields = require('../../../../lib/get-form-fields');
const api = require('./api');
const ui = require('./ui');
const gameUi = require('../gameActions/ui');
const gameModel = require('../../game/gameModel');

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


const addHandlers = () => {

  //
  //buttons
  //

  $('#sign-up').on('submit', onSignUp);
  $('#sign-in').on('submit', onSignIn);
  $('#change-password').on('submit', onChangePassword);

  // note click since not in a form
  $('#sign-out').on('click', onSignOut);

};

module.exports = {
  addHandlers,
};
