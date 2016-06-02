'use strict';

const app = require('./app.js');

$('.table-section').hide();
$('.hideable').hide();
$('.game-over-section').hide();
$('.not-signed-in').show();
$('#signInModal').modal('hide');
$('#signUpModal').modal('hide');
$('#gameUpdateModal').modal('hide');

app.user = null;
app.games = [];
app.finished_games = [];

const authEvents = require('./apiActions/userActions/events.js');
const gameEvents = require('./apiActions/gameActions/events.js');
const gameMoves = require('./game/gameMoves.js');

// On document ready
$(() => {
  authEvents.addHandlers();
  gameEvents.addHandlers();
  gameMoves.addHandlers();
});
