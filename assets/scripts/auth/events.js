'use strict';

const getFormFields = require('../../../lib/get-form-fields');
const api = require('./api');
const ui = require('./ui');
const gameModel = require('../game/gameModel');
const gameChecks = require('../game/gameChecks');
const turnEffects = require('../game/turnEffects');

let currentPlayer = gameModel.currentPlayer;
let currentSymbol = gameModel.currentSymbol;
let otherPlayer = gameModel.otherPlayer;
let otherSymbol = gameModel.otherPlayer;

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
  .then(ui.showBoard)
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

  api.joinGame(gameId)
  .done(ui.success)
  .then(ui.successJoin)
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
  if(gameModel.gameOver === false && gameModel.activeGame === true){

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
      gameModel.updateGameInfo();

      // update object for API
      turnEffects.updateAPI(modelGameIndex, currentSymbol);

      // check if the game is over
      gameModel.gameOver = gameChecks.checkGame();

      if(gameModel.gameOver === false){

        // swap players
        let NewPlayersSymbols = gameModel.swapPlayers();

        currentPlayer = NewPlayersSymbols[0];
        otherPlayer = NewPlayersSymbols[1];
        currentSymbol = NewPlayersSymbols[2];
        otherSymbol  = NewPlayersSymbols[3];

        gameModel.currentPlayer = NewPlayersSymbols[0];
        gameModel.otherPlayer = NewPlayersSymbols[1];
        gameModel.currentSymbol = NewPlayersSymbols[2];
        gameModel.otherSymbol  = NewPlayersSymbols[3];

        // count turn number
        gameModel.turnCount += 1;

        // check if game over now
        gameModel.gameOver = gameChecks.checkGame();

        if(gameModel.gameOver !== true){
          $('#player-turn').text(currentPlayer + "'s Turn!");
          $('#game-update-modal').text(currentPlayer + "'s Turn!");

        } else if (gameModel.winner === null){
          gameModel.winner = 'Tie';
          gameModel.winnerString = "Game over! It's a tie!";
          gameModel.newGame.over = true;

          $('#player-turn').text(gameModel.winnerString);
          $('#game-update-modal').text(gameModel.winnerString);
          $('#gameUpdateModal').modal('show');

          $('.table-section').hide();
          $('.game-over-section').show();

        } else {
          gameModel.winner = otherPlayer;
          gameModel.winnerString = 'Game over! ' + otherPlayer + ' Wins!';
          gameModel.newGame.over = true;

          $('#player-turn').text(gameModel.winnerString);
          $('#game-update-modal').text(gameModel.winnerString);
          $('#gameUpdateModal').modal('show');

          $('.table-section').hide();
          $('.game-over-section').show();

        }

      } else{
        if(gameModel.turnCount < gameModel.maxTurnCount){
          gameModel.winner = currentPlayer;
          gameModel.winnerString = 'Game over! ' + currentPlayer + ' Wins!';
          gameModel.newGame.over = true;
        } else {
          gameModel.winner = null;
          gameModel.winnerString = "Game over! It's a tie!";
          gameModel.newGame.over = true;
        }

        console.log('The game is over! Start a new game!');
        $('#player-turn').text(gameModel.winnerString);
        $('#game-update-modal').text(gameModel.winnerString);
        $('#gameUpdateModal').modal('show');

        $('.table-section').hide();
        $('.game-over-section').show();

      }
    }
  } else if (gameModel.gameOver === true){

    console.log('The game is over! Start a new game!');
    $('.table-section').hide();

    $('#player-turn').text('Game over! Start a new Game!');
    $('#game-update-modal').text('Game over! Start a new Game!');

    $('.game-over-section').show();

  } else if(gameModel.activeGame === false){
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
  $('#change-password').on('submit', onChangePassword);
  $('#new-game').on('submit', onNewGame);
  $('#get-games').on('submit', onGetGames);
  $('#get-done-games').on('submit', onGetDoneGames);
  $('#join-game').on('submit', onJoinGame);
  $('#show-this-game-info').on('submit', onShowGameInfo);
  $('#show-any-game-info').on('submit', onShowAnyGameInfo);
  $('#play-this-game').on('submit', onPlayThisGame);
  $('#start-another-game').on('submit', onNewGame);

  // note click since not in a form
  $('#sign-out').on('click', onSignOut);

  //
  // table cells
  //

  $('.cell').on('click', onSetCellValue);
};

module.exports = {
  addHandlers,
};
