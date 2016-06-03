'use strict';

const gameModel = require('../game/gameModel.js');
const gameChecks = require('../game/gameChecks.js');
const playersFile = require('../game/players.js');

let symbols = playersFile.symbols;
let players = playersFile.players;

// create new user
const botMove = function(gameObject){

  // the bot should assume it is its turn
  // the bot also assumes if it returns a cell,
  // the correct marker will be put there.

  // "move" is the eventual move the bot makes, in the format of cell index

  // the bot chooses the middle if the board is empty
  let move = 4;

  // understand the board
  let gameCells = gameObject.cells;

  let max = gameCells.length;
  let uniqueSymbols = [];
  for(let i = 0; i < max; i++){
    if($.inArray(gameCells[i], uniqueSymbols) !== -1){
      uniqueSymbols.push(gameCells[i]);
    }
  }

  // counts
  let xCount = 0;
  let yCount = 0;

  for(let i = 0; i < max; i++){
    if(gameCells[i] === symbols[0]){
      xCount += 1;
    }
  }

  for(let i = 0; i < max; i++){
    if(gameCells[i] === symbols[1]){
      yCount += 1;
    }
  }

  if(xCount === yCount){
    let myPlayer = players[0];
    let mySymbol = symbols[0];
  }else{
    let myPlayer = players[1];
    let mySymbol = symbols[1];
  }

  let turnCount = xCount + yCount;

  if(turnCount === gameModel.maxTurnCount || turnCount > gameModel.maxTurnCount){
    return false;
  } else if(turnCount === 0){
    move = 4;
  } else if(turnCount === 1 && cells[4] === ''){
    move = 4;

    /////// THIS IS WHERE I WILL ADD ALL OF THE MORE COMPLEX POSSIBLE SCENARIOS

  } else {
    for(let i = 0; i < max; i++){
      if(gameCells[i] === ''){
        move = i;
      }
    }
  }

  return move;
};

module.exports = {
  botMove,
};
