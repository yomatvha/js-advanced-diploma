import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameState from '../GameState';
import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

test('onCellEnterTitle', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const bowman = new PositionedCharacter(new Bowman(1), 1);
  gameController.gameState.playerTeam.push(bowman);
  gameController.onCellEnter(1);
  expect(gamePlay.cells[1].title).toBe(`\u{1F396}${bowman.character.level}\u{2694}${bowman.character.attack}\u{1F6E1}${bowman.character.defence}\u{2764}${bowman.character.health}`);
});

test('onCellEnterTeammateCursor', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const bowman = new PositionedCharacter(new Bowman(1), 1);
  const magician = new PositionedCharacter(new Magician(1), 8);
  gameController.gameState.playerTeam.push(bowman);
  gameController.gameState.playerTeam.push(magician);
  gameController.onCellClick(1);
  gameController.onCellEnter(9);
  expect(gamePlay.boardEl.style.cursor).toBe('pointer');
});

test('bowmanCanMoveCells', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const bowman = new PositionedCharacter(new Bowman(1), 0);
  gameController.gameState.playerTeam.push(bowman);
  gameController.onCellClick(0);
  gameController.canMove();
  const expected = [1, 9, 8, 2, 18, 16];

  expect(gameController.gameState.canMoveCells).toEqual(expected);
});

test('bowmanCanStrikeCells', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const swordsman = new PositionedCharacter(new Bowman(1), 33);
  const undead = new PositionedCharacter(new Undead(1), 35);
  const vampire = new PositionedCharacter(new Vampire(1), 50);
  const daemon = new PositionedCharacter(new Daemon(1), 60);
  gameController.gameState.playerTeam.push(swordsman);
  gameController.gameState.compTeam.push(undead);
  gameController.gameState.compTeam.push(vampire);
  gameController.gameState.compTeam.push(daemon);
  gameController.onCellClick(33);
  gameController.canStrike();
  const expected = [35, 50];

  expect(gameController.gameState.canStrikeCells).toEqual(expected);
});

test('magicianCanMoveCells', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const magician = new PositionedCharacter(new Magician(1), 41);
  gameController.gameState.playerTeam.push(magician);
  gameController.onCellClick(41);
  gameController.canMove();
  const expected = [42, 50, 34, 40, 48, 32, 49, 33];

  expect(gameController.gameState.canMoveCells).toEqual(expected);
});

test('magicianCanStrikeCells', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const magician = new PositionedCharacter(new Magician(1), 25);
  const undead = new PositionedCharacter(new Undead(1), 60);
  const daemon = new PositionedCharacter(new Daemon(1), 7);
  gameController.gameState.playerTeam.push(magician);
  gameController.gameState.compTeam.push(undead);
  gameController.gameState.compTeam.push(daemon);
  gameController.onCellClick(25);
  gameController.canStrike();
  const expected = [60];

  expect(gameController.gameState.canStrikeCells).toEqual(expected);
});

test('swordsmanCanMoveCells', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const swordsman = new PositionedCharacter(new Swordsman(1), 0);
  const undead = new PositionedCharacter(new Undead(1), 3);
  const vampire = new PositionedCharacter(new Vampire(1), 9);
  const daemon = new PositionedCharacter(new Daemon(1), 24);
  gameController.gameState.playerTeam.push(swordsman);
  gameController.gameState.compTeam.push(undead);
  gameController.gameState.compTeam.push(vampire);
  gameController.gameState.compTeam.push(daemon);
  gameController.onCellClick(0);
  gameController.canMove();
  const expected = [1, 8, 2, 18, 16, 27, 4, 36, 32];

  expect(gameController.gameState.canMoveCells).toEqual(expected);
});

test('swordsmanCanStrikeCells', () => {
  const gamePlay = new GamePlay();
  const gameState = new GameState();
  const container = document.createElement('div');
  container.outerHTML = '<div id="game-container"></div>';
  gamePlay.bindToDOM(container);
  const gameController = new GameController(gamePlay, gameState);
  gameController.init();
  gameController.gameState.playerTeam = [];
  gameController.gameState.compTeam = [];
  gamePlay.redrawPositions(gameController.gameState.playerTeam.concat(gameController.gameState.compTeam));

  const swordsman = new PositionedCharacter(new Swordsman(1), 33);
  const undead = new PositionedCharacter(new Undead(1), 34);
  gameController.gameState.playerTeam.push(swordsman);
  gameController.gameState.compTeam.push(undead);
  gameController.onCellClick(33);
  gameController.canStrike();
  const expected = [34];

  expect(gameController.gameState.canStrikeCells).toEqual(expected);
});
