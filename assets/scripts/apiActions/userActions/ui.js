'use strict';

const app = require('../../app.js');

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

const signUpSuccess = function(){
  $('#sign-in-email').val($('#sign-up-email').val());
  $('#sign-in-pw').val($('#sign-up-pw').val());
  $('#sign-in').submit();
  $('#signUpModal').modal('hide');

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

module.exports = {
  success,
  failure,
  signUpSuccess,
  signInSuccess,
  changePasswordSuccess,
  signOutSuccess,
};
