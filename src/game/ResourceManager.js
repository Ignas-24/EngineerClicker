export class ResourceManager {
  game;
  euro = 0;

  constructor(game) {
    this.game = game;
  }

  addEuros(delta) {
    this.euro += delta;
    this.game.notifyUpdate();
  }
}
