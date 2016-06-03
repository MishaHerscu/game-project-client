'use strict';

//
// imports
//

// const games = require('./games');
const playersFile = require('./players.js');
const games = require('./games.js');
const app = require('../app.js');

let symbols = playersFile.symbols;
let players = playersFile.players;
let gameTypes = games.gameTypes;

//
// game vars
//

let currentPlayer = players[0];
let otherPlayer = players[1];
let currentSymbol = symbols[currentPlayer];
let otherSymbol = symbols[otherPlayer];

let activeGame = false;
let gameOver = false;

let gameSize = 3;
let maxTurnCount = Math.pow(gameSize,2);

let turnCount = 0;

let winner = null;
let winnerString = '';

let newWatcher = null;

let gameType = gameTypes[0];
let botGame = false;

let newGame = {
  id: null,
  cells: null,
  over: null,
  player_x: null,
  player_o: null,
};

let boardDict = {
  'cell-00': '',
  'cell-01': '',
  'cell-02': '',
  'cell-10': '',
  'cell-11': '',
  'cell-12': '',
  'cell-20': '',
  'cell-21': '',
  'cell-22': '',
};

let boardTrans = [
  'cell-00',
  'cell-01',
  'cell-02',
  'cell-10',
  'cell-11',
  'cell-12',
  'cell-20',
  'cell-21',
  'cell-22'
];

const updateGameType = function(gameObject){
  if(gameObject.player_x !== null && gameObject.player_x !== undefined && gameObject.player_o !== null && gameObject.player_o !== undefined && botGame === false){
    gameType = gameTypes[1];
  }else if(botGame === true){
    gameType = gameTypes[2];
  }else{
    gameType = gameTypes[0];
  }
};

const swapPlayers = function(gameObject){

  let NewPlayersSymbols = [currentPlayer, otherPlayer, currentSymbol, otherSymbol];

  switch(gameType){
    case gameTypes[1]:

      if(gameObject.player_x.email === app.user.email){
        currentPlayer = players[0];
        currentSymbol = symbols[currentPlayer];
        otherPlayer = players[1];
        otherSymbol = symbols[otherPlayer];
      }else{
        currentPlayer = players[1];
        currentSymbol = symbols[currentPlayer];
        otherPlayer = players[0];
        otherSymbol = symbols[otherSymbol];
      }

      NewPlayersSymbols = [
        currentPlayer,
        otherPlayer,
        currentSymbol,
        otherSymbol
      ];

      break;

    case gameTypes[2]:

      NewPlayersSymbols = [
        currentPlayer,
        otherPlayer,
        currentSymbol,
        otherSymbol
      ];

      break;

    default:

      if(currentPlayer === players[0]){

        currentPlayer = players[1];
        currentSymbol = symbols[players[1]];
        otherPlayer = players[0];
        otherSymbol = symbols[players[0]];

        NewPlayersSymbols = [players[1], players[0], symbols[players[1]], symbols[players[0]]];

      }else if (currentPlayer === players[1]){

        currentPlayer = players[0];
        currentSymbol = symbols[players[0]];
        otherPlayer = players[1];
        otherSymbol = symbols[players[1]];

        NewPlayersSymbols = [players[0], players[1], symbols[players[0]], symbols[players[1]]];

      }else{
        console.log('There is an error with toggling currentPlayer!');
        return false;
      }
      break;
  }

  return NewPlayersSymbols;
  };

module.exports = {
  currentPlayer,
  currentSymbol,
  otherPlayer,
  otherSymbol,
  symbols,
  players,
  newGame,
  boardDict,
  activeGame,
  gameOver,
  gameSize,
  swapPlayers,
  boardTrans,
  maxTurnCount,
  turnCount,
  winner,
  winnerString,
  newWatcher,
  gameType,
  updateGameType,
};
