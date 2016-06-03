'use strict';

const gameModel = require('./gameModel.js');
const gameChecks = require('./gameChecks.js');
const turnEffects = require('./turnEffects.js');

let currentPlayer = gameModel.currentPlayer;
let currentSymbol = gameModel.currentSymbol;
let otherPlayer = gameModel.otherPlayer;
let otherSymbol = gameModel.otherPlayer;


const redrawBoard = function(){

  // check that game exists
  if(gameModel.newGame.cells === null){
    return false;
  }

  // set variables
  let max = gameModel.newGame.cells.length;

  // update board
  for(let i = 0; i < max; i++){
    $('#' + gameModel.boardTrans[i]).text(gameModel.newGame.cells[i]);
  }

  return true;
};

const refreshGameInfoTable = function(gameObject){

  if(gameObject === null || gameObject.id === null || gameObject === undefined || gameObject.id === undefined){

    return false;

  }else{

    $("#game-id-data").text(gameObject.id);
    $("#game-cells-data").text(gameObject.cells);
    $("#game-over-data").text(gameObject.over);

    if(gameObject.player_x === null || gameObject.player_x === undefined){
      $("#player-x-data").text("N/A");
    }else{
      $("#player-x-data").text(gameObject.player_x.email);
    }
    if(gameObject.player_o === null || gameObject.player_o === undefined){
      $("#player-o-data").text("N/A");
    }else{
      $("#player-o-data").text(gameObject.player_o.email);
    }

  }

  return true;

};

const onSetCellValue = function(){

  // you can only go if there is an active, non-over game
  // eventually maybe these variables should be combined into one
  if(gameModel.gameOver === false && gameModel.activeGame === true){

    // update gameType
    gameModel.updateGameType(gameModel.newGame);

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

      // update game info view
      refreshGameInfoTable(gameModel.newGame);

      // check if the game is over
      gameModel.gameOver = gameChecks.checkGame();

      // update object for API
      turnEffects.updateAPI(modelGameIndex, currentSymbol);

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
  $('.cell').on('click', onSetCellValue);
};


module.exports = {
  redrawBoard,
  refreshGameInfoTable,
  addHandlers,
};
