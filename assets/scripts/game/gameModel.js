'use strict';

//
// imports
//

// const games = require('./games');
const players = require('./players.js');
const games = require('./games.js');

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
  boardTrans,
  maxTurnCount,
  turnCount,
  winner,
  winnerString,
  newWatcher,
  gameType,
  xCount,
  oCount,
  playerJoined,
  cancelGameResets,
};
