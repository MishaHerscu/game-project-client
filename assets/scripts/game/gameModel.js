'use strict';

//
// imports
//

// const games = require('./games');
const players = require('./players.js');
const games = require('./games.js');
const app = require('../app.js');

//
// variables that don't change during games
//

let gameTypes = games.gameTypes;

let gameSize = 3;
let maxTurnCount = Math.pow(gameSize,2);

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

//
// variables that may change during games
//

let currentPlayer = players.players[0];
let otherPlayer = players.players[1];
let currentSymbol = players.symbols[currentPlayer];
let otherSymbol = players.symbols[otherPlayer];

let activeGame = false;
let gameOver = false;

let turnCount = 0;
let xCount = 0;
let oCount = 0;

let winner = null;
let winnerString = '';

let newWatcher = null;

let gameType = gameTypes[0];
let botGame = false;

let playerJoined = false;

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

//
// functions
//

const cancelGameResets = function(){

  currentPlayer = players.players[0];
  otherPlayer = players.players[1];
  currentSymbol = players.symbols[currentPlayer];
  otherSymbol = players.symbols[otherPlayer];

  activeGame = false;
  gameOver = false;

  turnCount = 0;
  xCount = 0;
  oCount = 0;

  winner = null;
  winnerString = '';

  newWatcher = null;

  gameType = gameTypes[0];
  botGame = false;

  playerJoined = false;

  newGame = {
    id: null,
    cells: null,
    over: null,
    player_x: null,
    player_o: null,
  };

  boardDict = {
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
  return true;
};

const updateGameType = function(gameObject){
  if(gameObject.player_x !== null && gameObject.player_x !== undefined && gameObject.player_o !== null && gameObject.player_o !== undefined && botGame === false){
    gameType = gameTypes[1];
  }else if(botGame === true){
    gameType = gameTypes[2];
  }else{
    gameType = gameTypes[0];
  }
  return gameType;
};

const swapPlayers = function(gameObject){

  let NewPlayersSymbols = [currentPlayer, otherPlayer, currentSymbol, otherSymbol];

  switch(gameType){
    case gameTypes[1]:

      if(gameObject.player_x.email === app.user.email){
        currentPlayer = players.players[0];
        currentSymbol = players.symbols[currentPlayer];
        otherPlayer = players.players[1];
        otherSymbol = players.symbols[otherPlayer];
      }else{
        currentPlayer = players.players[1];
        currentSymbol = players.symbols[currentPlayer];
        otherPlayer = players.players[0];
        otherSymbol = players.symbols[otherSymbol];
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

      if(currentPlayer === players.players[0]){

        currentPlayer = players.players[1];
        currentSymbol = players.symbols[players.players[1]];
        otherPlayer = players.players[0];
        otherSymbol = players.symbols[players.players[0]];

        NewPlayersSymbols = [players.players[1], players.players[0], players.symbols[players.players[1]], players.symbols[players.players[0]]];

      }else if (currentPlayer === players.players[1]){

        currentPlayer = players.players[0];
        currentSymbol = players.symbols[players.players[0]];
        otherPlayer = players.players[1];
        otherSymbol = players.symbols[players.players[1]];

        NewPlayersSymbols = [players.players[0], players.players[1], players.symbols[players.players[0]], players.symbols[players.players[1]]];

      }else{
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
  xCount,
  oCount,
  playerJoined,
  cancelGameResets,
};
