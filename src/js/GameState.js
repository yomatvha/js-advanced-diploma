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
    this.gameOver = false;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
