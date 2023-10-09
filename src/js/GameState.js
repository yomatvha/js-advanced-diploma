export default class GameState {
  constructor() {
    this.playerMove = true;
    this.playerTeam = [];
    this.compTeam = [];
    this.selectedCell = null;
    this.cellCharacter = undefined;
    this.canMoveCells = [];
    this.canStrikeCells = [];
    this.currentLevel = 1;
    this.currentResult = 0;
    this.bestResult = 0;
    this.teamSize = 2;
    this.gameOver = false;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
