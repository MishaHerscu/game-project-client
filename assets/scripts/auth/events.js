'use strict';

const getFormFields = require('../../../lib/get-form-fields');
const api = require('./api');
const ui = require('./ui');
const gameLogic = require('../game/gameLogic');
const gameChecks = require('../game/gameChecks');
const turnEffects = require('../game/turnEffects');

let currentPlayer = gameLogic.currentPlayer;
let currentSymbol = gameLogic.currentSymbol;
let otherPlayer = gameLogic.otherPlayer;
let otherSymbol = gameLogic.otherPlayer;

const onSignUp = function(event){
  event.preventDefault();
  gameLogic.activeGame = false;

  let data = getFormFields(event.target);
  api.signUp(data)
  .done(ui.success)
  .fail(ui.failure);

};

const onSignIn = function(event){
  event.preventDefault();
  gameLogic.activeGame = false;

  let data = getFormFields(event.target);
  api.signIn(data)
  .done(ui.signInSuccess)
  .then(ui.showBoard)
  .fail(ui.failure);
};

const onSignOut = function(event){
  event.preventDefault();
  gameLogic.activeGame = false;

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
  .then(ui.showBoard)
  .fail(ui.failure);

};

const onNewGame = function(event){
  event.preventDefault();

  api.newGame()
  .done(ui.success)
  .then(ui.newGame)
  .then(ui.showBoard)
  .then(ui.updateGames)
  .then(ui.updateFinishedGames)
  .fail(ui.failure);

};

const onGetGames = function(event){
  event.preventDefault();

  api.showGames()
  .done(ui.success)
  .then(ui.updateGames)
  .fail(ui.failure);

};

const onGetDoneGames = function(event){
  event.preventDefault();

  api.showOverGames()
  .done(ui.success)
  .then(ui.updateFinishedGames)
  .fail(ui.failure);

};

const onJoinGame = function(event){
  event.preventDefault();
  let gameId = $('#game-to-join').val();
  let authToken = $('#auth-token-to-join').val();

  api.joinGame(gameId, authToken)
  .done(ui.success)
  .fail(ui.failure);
};

const onShowGameInfo = function(){
  event.preventDefault();

  api.showGameInfo()
  .done(ui.successShowGameInfo)
  .fail(ui.failure);
};

const onShowAnyGameInfo = function(event){
  event.preventDefault();
  let gameId = $('#any-game-id').val();
  let authToken = $('#any-game-auth').val();

  api.show(gameId, authToken)
  .done(ui.successShowGameInfo)
  .fail(ui.failure);
};

const onPlayThisGame = function(event){
  event.preventDefault();
  let gameId = $('#game-to-play-id').val();
  let authToken = $('#game-to-play-auth').val();

  api.play(gameId, authToken)
  .done(ui.successPlayThisGame)
  .fail(ui.failure);
};

const onSetCellValue = function(){

  // you can only go if there is an active, non-over game
  // eventually maybe these variables should be combined into one
  if(gameLogic.gameOver === false && gameLogic.activeGame === true){

    // the clicked cell and the value of that cell
    let currentVal = $(this).text();
    let clickedCell = this.id;

    // check if the cell is empty
    if(!turnEffects.checkCellEmpty(currentVal)){
      return false;
    } else {

      // set the new value using the currentSymbol
      $(this).text(currentSymbol);

      // update model
      let modelGameIndex = turnEffects.updateModelValues(currentSymbol, clickedCell);

      // update model
      gameLogic.updateGameInfo();

      // update object for API
      turnEffects.updateAPI(modelGameIndex, currentSymbol);

      // check if the game is over
      gameLogic.gameOver = gameChecks.checkGame();

      if(gameLogic.gameOver === false){

        // swap players
        let NewPlayersSymbols = gameLogic.swapPlayers();

        currentPlayer = NewPlayersSymbols[0];
        otherPlayer = NewPlayersSymbols[1];
        currentSymbol = NewPlayersSymbols[2];
        otherSymbol  = NewPlayersSymbols[3];

        gameLogic.currentPlayer = NewPlayersSymbols[0];
        gameLogic.otherPlayer = NewPlayersSymbols[1];
        gameLogic.currentSymbol = NewPlayersSymbols[2];
        gameLogic.otherSymbol  = NewPlayersSymbols[3];

        // count turn number
        gameLogic.turnCount += 1;

        // check if game over now
        gameLogic.gameOver = gameChecks.checkGame();

        if(gameLogic.gameOver !== true){
          $('#player-turn').text(currentPlayer + "'s Turn!");
        } else if (gameLogic.winner === null){
          gameLogic.winner = 'Tie';
          gameLogic.winnerString = "Game over! It's a tie!";
          gameLogic.newGame.over = true;

          $('#player-turn').text(gameLogic.winnerString);
          $('.table-section').hide();
          $('.game-over-section').show();

        } else {
          gameLogic.winner = otherPlayer;
          gameLogic.winnerString = 'Game over! ' + otherPlayer + ' Wins!';
          gameLogic.newGame.over = true;

          $('#player-turn').text(gameLogic.winnerString);
          $('.table-section').hide();
          $('.game-over-section').show();

        }

      } else{
        if(gameLogic.turnCount < gameLogic.maxTurnCount){
          gameLogic.winner = currentPlayer;
          gameLogic.winnerString = 'Game over! ' + currentPlayer + ' Wins!';
          gameLogic.newGame.over = true;
        } else {
          gameLogic.winner = null;
          gameLogic.winnerString = "Game over! It's a tie!";
          gameLogic.newGame.over = true;
        }

        console.log('The game is over! Start a new game!');
        $('#player-turn').text(gameLogic.winnerString);
        $('.table-section').hide();
        $('.game-over-section').show();

      }
    }
  } else if (gameLogic.gameOver === true){

    console.log('The game is over! Start a new game!');
    $('.table-section').hide();
    $('#player-turn').text('Game over! Start a new Game!');
    $('.game-over-section').show();

  } else if(gameLogic.activeGame === false){
    console.log('You need to activate or start a game!');

  } else {
    console.log('There is a weird error with gameOver');
  }

  return true;
};

const addHandlers = () => {

  //
  //buttons
  //

  $('#sign-up').on('submit', onSignUp);
  $('#sign-in').on('submit', onSignIn);
  $('#sign-out').on('submit', onSignOut);
  $('#change-password').on('submit', onChangePassword);
  $('#new-game').on('submit', onNewGame);
  $('#get-games').on('submit', onGetGames);
  $('#get-done-games').on('submit', onGetDoneGames);
  $('#join-game').on('submit', onJoinGame);
  $('#show-this-game-info').on('submit', onShowGameInfo);
  $('#show-any-game-info').on('submit', onShowAnyGameInfo);
  $('#play-this-game').on('submit', onPlayThisGame);

  //
  // table cells
  //

  $('.cell').on('click', onSetCellValue);
};

module.exports = {
  addHandlers,
};
