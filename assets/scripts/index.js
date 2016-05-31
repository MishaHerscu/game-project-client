'use strict';

const app = require('./app.js');

$('.table-section').hide();
$('.hideable').hide();
$('.game-over-section').hide();
$('.not-signed-in').show();

app.user = null;
app.games = [];
app.finished_games = [];


const authEvents = require('./auth/events.js');

// On document ready
$(() => {
  authEvents.addHandlers();
});
