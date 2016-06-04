'use strict';

const app = require('../../app.js');
const gameChecks = require('../../game/gameChecks.js');
const gameModel = require('../../game/gameModel.js');
const gameMoves = require('../../game/gameMoves.js');
const games = require('../../game/games.js');
const gameWatcherMaker = require('../../watch/make-watcher.js');
const gameWatcherAttachHandler = require('../../watch/watcher-event-handlers.js');

const success = function(data){

  if(data){
    // console.log(data);
  }else{
    // console.log('GREAT SUCCESS!!!!!');
  }

  // redraw Board
  gameMoves.redrawBoard();

};

const failure = function(error){
  if(error !== undefined || error !== null){
    // console.error(error);
  }
};

const showBoard = function(){
  $('.hideable').show();
};

const hideBoard = function(){
  $('.table-section').hide();
  $('.hideable').hide();
};

const updateView = function(){
  gameMoves.refreshCounts();
  gameMoves.redrawBoard();
  gameMoves.refreshGameInfoTable(gameModel.newGame);
};

const successMove = function(){
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
    gameMoves.refreshCounts();
    gameModel.updateGameType(gameModel.newGame);
    gameMoves.refreshGameInfoTable(gameModel.newGame);
  }
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
  gameMoves.refreshGameInfoTable(gameObject);
  gameMoves.redrawBoard();
  gameMoves.refreshCounts();
};

const successJoin = function(data){

  gameModel.newGame = data.game;

  //
  // reset game model variables
  //

  // turns gone for each player and total
  gameMoves.refreshCounts();

  $('.table-section').hide();
  $('.hideable').hide();
  $('.game-over-section').hide();
  $('#gameUpdateModal').modal('hide');

  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  gameModel.activeGame = true;

  gameModel.newWatcher = gameWatcherMaker.gameWatcher(gameModel.newGame.id, app.user.token);
  gameWatcherAttachHandler.addHandlers(gameModel.newWatcher);

  // set yourself as player_o
  gameModel.currentPlayer = gameModel.players.players[1];
  gameModel.otherPlayer = gameModel.players.players[0];
  gameModel.currentSymbol = gameModel.players.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.players.symbols[gameModel.otherPlayer];
  gameMoves.onGameCheck(gameModel.newGame);

  // redraw Board
  gameMoves.redrawBoard();

  // show game info
  if(gameModel.newGame.id !== null && gameModel.newGame.id !== undefined){
    gameMoves.refreshGameInfoTable(gameModel.newGame);
  }

  // display status
  $('#player-turn').text(gameModel.currentPlayer + "'s Turn!");
  $('#game-update-modal').text(gameModel.currentPlayer + "'s Turn!");

  // reset view
  $('.table-section').show();
  $('.hideable').show();
  $('.not-signed-in').hide();

};

const successPlayThisGame = function(data){
  gameModel.newGame = data.game;

  // show game info
  if(gameModel.newGame.id !== null){
    gameMoves.refreshGameInfoTable(gameModel.newGame);
    gameMoves.refreshCounts();
  }
};

const newGame = function(data){

  // instantiate new game
  gameModel.newGame = new games.game(data.game);

  // check game type
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  // should be zero
  gameMoves.refreshCounts();

  // reset some game vars
  gameModel.turnCount = 0;
  gameModel.winner = null;
  gameModel.winnerString = '';
  gameModel.playerJoined = false;

  $('.table-section').hide();
  $('.hideable').hide();
  $('.game-over-section').hide();
  $('#gameUpdateModal').modal('hide');

  // reset gameOver and activeGame
  gameModel.gameOver = gameModel.newGame.over;
  gameModel.activeGame = true;

  // set initial params
  gameModel.currentPlayer = gameModel.players.players[0];
  gameModel.otherPlayer = gameModel.players.players[1];
  gameModel.currentSymbol = gameModel.players.symbols[gameModel.currentPlayer];
  gameModel.otherSymbol = gameModel.players.symbols[gameModel.otherPlayer];

  // display status
  $('#player-turn').text(gameModel.currentPlayer + "'s Turn!");
  $('#game-update-modal').text(gameModel.currentPlayer + "'s Turn!");

  // watch for updates
  $('#game-to-watch').val(gameModel.newGame.id);
  $('#watch-game').submit();

  // reset view
  $('.table-section').show();
  $('.hideable').show();
  $('.not-signed-in').hide();

};

const togglePlayer = function(){

  // update gameType (single vs double player)
  gameModel.gameType = gameModel.updateGameType(gameModel.newGame);

  if(gameModel.gameOver === false){

    // swap players
    let NewPlayersSymbols = gameModel.swapPlayers(gameModel.newGame);

    gameModel.currentPlayer = NewPlayersSymbols[0];
    gameModel.otherPlayer = NewPlayersSymbols[1];
    gameModel.currentSymbol = NewPlayersSymbols[2];
    gameModel.otherSymbol  = NewPlayersSymbols[3];

    // count turn number
    gameModel.turnCount += 1;

    // check if game over now
    gameModel.gameOver = gameChecks.checkGame(gameModel.newGame);
    gameModel.newGame.over = gameChecks.checkGame(gameModel.newGame);

    // check game and show responses
    gameMoves.onGameCheck(gameModel.newGame);
  }

  return true;
};

const checkGameStatus = function (){

  if(gameModel.newGame.over === false){
    return false;
  } else if(gameModel.turnCount < gameModel.maxTurnCount){
    gameModel.winner = gameModel.currentPlayer;
    gameModel.winnerString = 'Game over! ' + gameModel.currentPlayer + ' Wins!';
    gameModel.newGame.over = true;
  } else {
    gameModel.winner = null;
    gameModel.winnerString = "Game over! It's a tie!";
    gameModel.newGame.over = true;
  }

  $('#player-turn').text(gameModel.winnerString);
  $('#game-update-modal').text(gameModel.winnerString);
  $('#gameUpdateModal').modal('show');

  $('.table-section').hide();
  $('.game-over-section').show();

  return true;
};

module.exports = {
  success,
  failure,
  showBoard,
  hideBoard,
  updateView,
  successMove,
  updateGames,
  updateFinishedGames,
  successShowGameInfo,
  successJoin,
  successPlayThisGame,
  newGame,
  togglePlayer,
  checkGameStatus,
};
