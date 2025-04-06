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

  addEurosClicked() {
    const delta = this.clickPower * this.multiplier;
    this.euro = this.euro + delta;
    this.saveData();
    this.game.notifyUpdate();
  }
  
  changeEuros(delta) {
    this.euro = this.euro + delta;
    this.saveData();
    this.game.notifyUpdate();

    if (this.euro < 0 && this.game.loanManager) {
      const status = this.game.loanManager.checkNegativeBalance();
      return status;
    }
    return "ok";
  }

  changePrestige(delta) {
    this.prestige += delta;
    this.saveData();
    this.game.notifyUpdate();
  }

  setMultiplier(mult) {
    this.multiplier = mult;
    this.saveData();
    this.game.notifyUpdate();
  }

  addClickPower(delta) {
    this.clickPowerIncrease += delta;
    this.clickPower = this.initClickPower + this.clickPowerIncrease;
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
    localStorage.setItem("ResourceManagerData", JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem("ResourceManagerData");
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

  resetForBankruptcy() {
    this.euro = 0;
    this.clickPowerIncrease = 0;
    this.clickPower = this.initClickPower;
    this.saveData();
  }
}
