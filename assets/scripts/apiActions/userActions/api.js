'use strict';

const app = require('../../app.js');
const gameModel = require('../../game/gameModel');

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

module.exports = {
  signUp,
  signIn,
  signOut,
  changePassword,
};
