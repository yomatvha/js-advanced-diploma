import themes from './themes';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTypes = ['bowman', 'swordsman', 'magician'];
    this.compTypes = ['daemon', 'undead', 'vampire'];
    this.themesTypes = ['prairie', 'desert', 'arctic', 'mountain'];
    this.lines = [];
    this.gameState = new GameState();
  }

  resetState() {
    this.gameState.cellCharacter = undefined;
    this.gamePlay.deselectCell(this.gameState.selectedCell);
    this.gameState.selectedCell = null;
    this.gameState.canMoveCells = [];
    this.gameState.canStrikeCells = [];
  }

  changeMove() {
    this.resetState();
    this.gamePlay.redrawPositions(this.gameState.playerTeam.concat(this.gameState.compTeam));

    this.gameState.playerMove = !(this.gameState.playerMove);
    if (this.gameState.playerMove === false) {
      this.compMove();
    }
  }

  raiseAttack(character) {
    return Math.max(character.attack, character.attack * (80 + character.health) / 100);
  }

  raiseDefence(character) {
    return Math.max(character.defence, character.defence * (80 + character.health) / 100);
  }

  changeLevel() {
    this.gameState.currentLevel++;
    this.gameState.teamSize++;
    this.gameState.playerMove = true;
    this.resetState();

    for (let i = 0; i < this.gameState.playerTeam.length; i++) {
      this.gameState.playerTeam[i].character.level++;
      this.gameState.playerTeam[i].character.attack = this.raiseAttack(this.gameState.playerTeam[i].character);
      this.gameState.playerTeam[i].character.defence = this.raiseDefence(this.gameState.playerTeam[i].character);
      this.gameState.playerTeam[i].character.health = Math.min(this.gameState.playerTeam[i].character.health + 80, 100);
    }

    this.gamePlay.drawUi(themes[this.themesTypes[this.gameState.currentLevel - 1]]);
    this.generateTeams(this.gameState.teamSize - this.gameState.playerTeam.length, this.gameState.teamSize);
  }

  calcDamage(striker, defenseman) {
    return Math.floor(Math.max(striker.attack - defenseman.defence, striker.attack * 0.1));
  }

  compMove() {
    let a;
    for (let i = 0; i < this.gameState.compTeam.length; i++) {
      this.gameState.cellCharacter = this.gameState.compTeam[i];
      this.gameState.selectedCell = this.gameState.compTeam[i].position;
      this.canStrike();

      if (this.gameState.canStrikeCells.length > 0) {
        a = this.gameState.playerTeam.find((elem) => elem.position === this.gameState.canStrikeCells[0]);
        if (this.gameState.canStrikeCells.includes(a.position)) {
          const damage = this.calcDamage(this.gameState.cellCharacter.character, a.character);
          this.gamePlay.showDamage(a.position, damage).then(() => {
            a.character.health -= damage;
            if (a.character.health <= 0) {
              const findIndex = this.gameState.playerTeam.findIndex((elem) => elem.position === a.position);
              this.gameState.playerTeam.splice(findIndex, 1);
            }
            if (this.gameState.playerTeam.length === 0) {
              GamePlay.showMessage('Вы проиграли!');
              this.gameState.gameOver = true;
            } else {
              this.changeMove();
            }
          });
        }
        break;
      }
    }
    if (a === undefined) {
      this.gameState.cellCharacter = this.gameState.compTeam[Math.floor(Math.random() * this.gameState.compTeam.length)];
      this.gameState.selectedCell = this.gameState.cellCharacter.position;
      this.canMove();
      const ind = this.gameState.compTeam.findIndex((elem) => elem.position === this.gameState.selectedCell);
      this.gameState.compTeam[ind].position = this.gameState.canMoveCells[Math.floor(Math.random() * this.gameState.canMoveCells.length)];
      this.changeMove();
    }
  }

  getCell(teamIndex) {
    while (true) {
      let randomCell = Math.floor(Math.random() * this.gamePlay.boardSize * 2);
      if (randomCell % 2 === 0) {
        if (teamIndex === 0) {
          randomCell = randomCell * this.gamePlay.boardSize / 2;
        } else {
          randomCell = randomCell * this.gamePlay.boardSize / 2 + (this.gamePlay.boardSize - 2);
        }
      } else if (teamIndex === 0) {
        randomCell = randomCell * this.gamePlay.boardSize / 2 - (this.gamePlay.boardSize / 2 - 1);
      } else {
        randomCell = randomCell * this.gamePlay.boardSize / 2 - (this.gamePlay.boardSize / 2 - 1) + (this.gamePlay.boardSize - 2);
      }
      if (!(this.gameState.playerTeam.concat(this.gameState.compTeam).find((elem) => elem.position === randomCell))) {
        return randomCell;
      }
    }
  }

  generateTeams(playerTeamSize, compTeamSize) {
    const playerCharacters = generateTeam(this.playerTypes, this.gameState.currentLevel, playerTeamSize);
    const compCharacters = generateTeam(this.compTypes, this.gameState.currentLevel, compTeamSize);

    for (let i = 0; i < this.gameState.playerTeam.length; i++) {
      this.gameState.playerTeam[i].position = this.getCell(0);
    }

    for (let i = 0; i < playerTeamSize; i++) {
      if (playerCharacters.characters[i].level > 1) {
        for (let j = 2; j <= playerCharacters.characters[i].level; j++) {
          playerCharacters.characters[i].attack = this.raiseAttack(playerCharacters.characters[i]);
          playerCharacters.characters[i].defence = this.raiseDefence(playerCharacters.characters[i]);
        }
      }
      this.gameState.playerTeam.push(new PositionedCharacter(playerCharacters.characters[i], this.getCell(0)));
    }

    for (let i = 0; i < compTeamSize; i++) {
      if (compCharacters.characters[i].level > 1) {
        for (let j = 2; j <= compCharacters.characters[i].level; j++) {
          compCharacters.characters[i].attack = this.raiseAttack(compCharacters.characters[i]);
          compCharacters.characters[i].defence = this.raiseDefence(compCharacters.characters[i]);
        }
      }

      this.gameState.compTeam.push(new PositionedCharacter(compCharacters.characters[i], this.getCell(1)));
    }
    this.gamePlay.redrawPositions(this.gameState.playerTeam.concat(this.gameState.compTeam));
  }

  init() {
    this.gamePlay.drawUi(themes[this.themesTypes[this.gameState.currentLevel - 1]]);
    for (let i = 1; i <= this.gamePlay.boardSize; i++) {
      const line = [];
      for (let j = 1; j <= this.gamePlay.boardSize; j++) {
        line.push((i - 1) * this.gamePlay.boardSize + (j - 1));
      }
      this.lines.push(line);
    }
    this.generateTeams(this.gameState.teamSize, this.gameState.teamSize);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  onNewGameClick() {
    this.gameState.playerTeam = [];
    this.gameState.compTeam = [];
    this.gameState.currentLevel = 1;
    this.playerMove = true;
    this.gameState.teamSize = 2;
    this.gameState.cellCharacter = undefined;
    this.gameState.selectedCell = null;
    this.gameState.canMoveCells = [];
    this.gameState.canStrikeCells = [];
    this.gameState.gameOver = false;
    this.gameState.currentResult = 0;
    this.gamePlay.drawUi('prairie');
    this.generateTeams(this.gameState.teamSize, this.gameState.teamSize);
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
    GamePlay.showMessage('Игра успешно сохранена');
  }

  onLoadGameClick() {
    const loadGame = this.stateService.load();
    if (!loadGame) {
      GamePlay.showError('Ошибка загрузки');
    }
    this.gameState.playerMove = loadGame.playerMove;
    this.gameState.currentLevel = loadGame.currentLevel;
    this.gameState.playerTeam = [];
    this.gameState.compTeam = [];
    this.gameState.selectedCell = null;
    this.gameState.cellCharacter = undefined;
    this.gameState.canMoveCells = [];
    this.gameState.canStrikeCells = [];

    this.gameState.currentResult = loadGame.currentResult;
    this.gameState.teamSize = loadGame.teamSize;
    this.gameState.gameOver = loadGame.gameOver;
    this.gameState.playerTeam = loadGame.playerTeam;
    this.gameState.compTeam = loadGame.compTeam;

    this.gamePlay.drawUi(themes[this.themesTypes[this.gameState.currentLevel - 1]]);
    this.gamePlay.redrawPositions(this.gameState.playerTeam.concat(this.gameState.compTeam));
  }

  whoIsOnCell(index) {
    if (this.gameState.playerTeam.find((elem) => elem.position === index)) {
      return 1;
    } if (this.gameState.compTeam.find((elem) => elem.position === index)) {
      return 2;
    } return 0;
  }

  canMove() {
    let selectedCellIndex = null;
    this.gameState.canMoveCells = [];
    let a = 0;
    for (let i = 0; i < this.gamePlay.boardSize; i++) {
      selectedCellIndex = this.lines[i].findIndex((elem) => elem === this.gameState.selectedCell);
      if (selectedCellIndex >= 0) {
        for (let j = 1; j <= this.gameState.cellCharacter.character.move; j++) {
          if (selectedCellIndex + j < this.lines[i].length) {
            a = this.gameState.selectedCell + j;
            if (this.whoIsOnCell(a) === 0) {
              this.gameState.canMoveCells.push(a);
            }
            a = this.gameState.selectedCell + j + j * this.gamePlay.boardSize;
            if (a < this.gamePlay.cells.length && this.whoIsOnCell(a) === 0) {
              this.gameState.canMoveCells.push(a);
            }
            a = this.gameState.selectedCell + j - j * this.gamePlay.boardSize;
            if (a >= 0 && this.whoIsOnCell(a) === 0) {
              this.gameState.canMoveCells.push(a);
            }
          }
          if (selectedCellIndex - j >= 0) {
            a = this.gameState.selectedCell - j;
            if (this.whoIsOnCell(a) === 0) {
              this.gameState.canMoveCells.push(a);
            }
            a = this.gameState.selectedCell - j + j * this.gamePlay.boardSize;
            if (a < this.gamePlay.cells.length && this.whoIsOnCell(a) === 0) {
              this.gameState.canMoveCells.push(a);
            }
            a = this.gameState.selectedCell - j - j * this.gamePlay.boardSize;
            if (a >= 0 && this.whoIsOnCell(a) === 0) {
              this.gameState.canMoveCells.push(a);
            }
          }
          if (i + j < this.lines.length && this.whoIsOnCell(this.gameState.selectedCell + j * this.gamePlay.boardSize) === 0) {
            this.gameState.canMoveCells.push(this.gameState.selectedCell + j * this.gamePlay.boardSize);
          }
          if (i - j >= 0 && this.whoIsOnCell(this.gameState.selectedCell - j * this.gamePlay.boardSize) === 0) {
            this.gameState.canMoveCells.push(this.gameState.selectedCell - j * this.gamePlay.boardSize);
          }
        }
        break;
      }
    }
  }

  canStrike() {
    let selectedCellIndex = null;
    this.gameState.canStrikeCells = [];
    for (let i = 0; i < this.gamePlay.boardSize; i++) {
      selectedCellIndex = this.lines[i].findIndex((elem) => elem === this.gameState.selectedCell);
      if (selectedCellIndex >= 0) {
        for (let j = i - this.gameState.cellCharacter.character.strike; j <= i + this.gameState.cellCharacter.character.strike; j++) {
          if (j >= 0 && j < this.lines.length) {
            for (let k = selectedCellIndex - this.gameState.cellCharacter.character.strike; k <= selectedCellIndex + this.gameState.cellCharacter.character.strike; k++) {
              if (k >= 0 && k < this.lines[j].length) {
                if ((this.gameState.playerMove === true && this.whoIsOnCell(this.lines[j][k]) === 2)
                    || (this.gameState.playerMove === false && this.whoIsOnCell(this.lines[j][k]) === 1)) {
                  this.gameState.canStrikeCells.push(this.lines[j][k]);
                }
              }
            }
          }
        }
        break;
      }
    }
  }

  onCellClick(index) {
    if (this.gameState.gameOver === true) {
      return;
    }

    if (this.gameState.playerMove === true) {
      if (this.gameState.selectedCell !== index) {
        let found = false;

        let a = this.gameState.playerTeam.find((elem) => elem.position === index);
        if (a) {
          this.gameState.cellCharacter = a;
          if (this.gameState.selectedCell != null) {
            this.gamePlay.deselectCell(this.gameState.selectedCell);
          }
          this.gamePlay.selectCell(index);
          this.gameState.selectedCell = index;
          found = true;
          this.canMove();
          this.canStrike();
        } else {
          a = this.gameState.compTeam.find((elem) => elem.position === index);
          if (a) {
            if (this.gameState.canStrikeCells.includes(index)) {
              found = true;
              const damage = this.calcDamage(this.gameState.cellCharacter.character, a.character);
              this.gamePlay.showDamage(index, damage).then(() => {
                a.character.health -= damage;
                if (a.character.health <= 0) {
                  const findIndex = this.gameState.compTeam.findIndex((elem) => elem.position === index);
                  this.gameState.currentResult += Math.floor(this.gameState.compTeam[findIndex].character.attack);
                  this.gameState.compTeam.splice(findIndex, 1);
                }
                if (this.gameState.compTeam.length === 0) {
                  if (this.gameState.currentLevel < 4) {
                    this.changeLevel();
                  } else {
                    this.gamePlay.redrawPositions(this.gameState.playerTeam);
                    this.gameState.selectedCell = null;
                    this.gamePlay.cellCharacter = undefined;
                    this.gameState.bestResult = Math.max(this.gameState.currentResult, this.gameState.bestResult);
                    GamePlay.showMessage('Вы победили!\nНабрано очков: ' + this.gameState.currentResult + '\nЛучший результат: ' + this.gameState.bestResult);
                    this.gameState.gameOver = true;
                  }
                } else {
                  this.changeMove();
                }
              });
            } else {
              found = true;
              GamePlay.showError('Персонаж недоступен для атаки');
            }
          } else if (this.gameState.canMoveCells.includes(index)) {
            found = true;
            const ind = this.gameState.playerTeam.findIndex((elem) => elem.position === this.gameState.selectedCell);
            this.gameState.playerTeam[ind].position = index;
            this.changeMove();
          } else {
            found = true;
            GamePlay.showError('Поле недоступно для хода');
          }
        }

        if (found === false) {
          GamePlay.showError('Выбирайте своего персонажа');
        }
      }
    } else {
      GamePlay.showError('Сейчас ход противника');
    }
  }

  onCellEnter(index) {
    const cellPlayerCharacter = this.gameState.playerTeam.find((elem) => elem.position === index);
    const cellCompCharacter = this.gameState.compTeam.find((elem) => elem.position === index);
    if (cellPlayerCharacter) {
      this.gamePlay.showCellTooltip(`\u{1F396}${cellPlayerCharacter.character.level}\u{2694}${cellPlayerCharacter.character.attack}\u{1F6E1}${cellPlayerCharacter.character.defence}\u{2764}${cellPlayerCharacter.character.health}`, index);
    } else if (cellCompCharacter) {
      this.gamePlay.showCellTooltip(`\u{1F396}${cellCompCharacter.character.level}\u{2694}${cellCompCharacter.character.attack}\u{1F6E1}${cellCompCharacter.character.defence}\u{2764}${cellCompCharacter.character.health}`, index);
    }

    if (this.gameState.selectedCell !== null) {
      if (this.gameState.selectedCell === index) {
        this.gamePlay.setCursor('auto');
      } else if (this.gameState.selectedCell !== index && cellPlayerCharacter) {
        this.gamePlay.setCursor('pointer');
      } else if (cellPlayerCharacter === undefined && cellCompCharacter === undefined && this.gameState.canMoveCells.includes(index)) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(index, 'green');
      } else if (cellPlayerCharacter === undefined && cellCompCharacter && this.gameState.canStrikeCells.includes(index)) {
        this.gamePlay.setCursor('crosshair');
        this.gamePlay.selectCell(index, 'red');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    } else {
      this.gamePlay.setCursor('auto');
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor('auto');
    this.gamePlay.cells.forEach((element) => element.classList.remove('selected-green'));
    this.gamePlay.cells.forEach((element) => element.classList.remove('selected-red'));
  }
}
