export class ResourceManager {
  game;
  euro = 0;
  prestige = 0;
  multiplier = 1;
  initClickPower = 0.01;
  clickPowerIncrease = 0;
  clickPower = this.initClickPower;

  constructor(game) {
    this.game = game;
    this.loadData();
  }

  addEuros() {
    const delta = parseFloat((this.clickPower * this.multiplier).toFixed(2));
    this.euro = parseFloat((this.euro + delta).toFixed(2));
    this.saveData();
    this.game.notifyUpdate();
  }
  
  reduceEuros(delta) {
    this.euro = parseFloat((this.euro - delta).toFixed(2));
    this.saveData();
    this.game.notifyUpdate();
  }

  changePrestige(delta) {
    this.prestige += delta;
    this.saveData();
    this.game.notifyUpdate();
  }

  changeMultiplier(mult) {
    this.multiplier = mult;
    this.saveData();
    this.game.notifyUpdate();
  }

  changeClickPower(delta) {
    this.clickPowerIncrease += delta;
    this.clickPower = parseFloat((this.initClickPower + this.clickPowerIncrease).toFixed(2));
    this.saveData();
    this.game.notifyUpdate();
  }

  saveData() {
    const data = {
      euro: this.euro,
      prestige: this.prestige,
      multiplier: this.multiplier,
      initClickPower: this.initClickPower,
      clickPowerIncrease: this.clickPowerIncrease,
      clickPower: this.clickPower,
    };
    localStorage.setItem('ResourceMangerData', JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem('ResourceMangerData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.euro = data.euro || 0;
      this.prestige = data.prestige || 0;
      this.multiplier = data.multiplier || 1;
      this.initClickPower = data.initClickPower || 0.01;
      this.clickPowerIncrease = data.clickPowerIncrease || 0;
      this.clickPower = data.clickPower || this.initClickPower;
    }
  }
}
