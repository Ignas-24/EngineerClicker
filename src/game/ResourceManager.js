export class ResourceManager {
  game;
  euro = 0;

  constructor(game) {
    this.game = game;
    this.loadData();
  }

  addEuros(delta) {
    this.euro += delta;
    this.saveData();
    this.game.notifyUpdate();
  }

  saveData() {
    const data = {
      euro: this.euro,
    };
    localStorage.setItem('ResourceMangerData', JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem('ResourceMangerData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.euro = data.euro || 0;
    }
  }
}
