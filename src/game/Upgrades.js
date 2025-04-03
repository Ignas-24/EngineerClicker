export class Upgrades {
    game;
    maxPowerUgrades = 4;
    currentPowerUpgrade = 1;
    maxMultUgrades = 3;
    currentMultUpgrade = 1;
  
    constructor(game) {
      this.game = game;
      this.loadData();
    }

    powerUpgrade(){
        if(this.currentPowerUpgrade == this.maxPowerUgrades) { return; }
        switch(this.currentPowerUpgrade){
            case 1:
                this.game.resourceManager.changeClickPower(0.01);
                this.game.resourceManager.reduceEuros(0.5);
                break;
            case 2:
                this.game.resourceManager.changeClickPower(0.01);
                this.game.resourceManager.reduceEuros(1);
                break;
            case 3:
                this.game.resourceManager.changeClickPower(0.02);
                this.game.resourceManager.reduceEuros(5);
                break;
            case 4:
                this.game.resourceManager.changeClickPower(0.05);
                this.game.resourceManager.reduceEuros(20);
                break;
            default:
                break;
        }
        if(this.currentPowerUpgrade < this.maxPowerUgrades) { this.currentPowerUpgrade++; }
        this.saveData();
    }
    
    getCurrentPowerUpgrade(){
        return this.currentPowerUpgrade;
    }

    multUpgrade(){
        if(this.currentMultUpgrade == this.maxMultUgrades) { return; }
        if(this.game.resourceManager.prestige < 1) { return; }
        switch(this.currentMultUpgrade){
            case 1:
                this.game.resourceManager.changeMultiplier(2);
                this.game.resourceManager.changePrestige(-1);
                break;
            case 2:
                this.game.resourceManager.changeMultiplier(3);
                this.game.resourceManager.changePrestige(-1);
                break;
            case 3:
                this.game.resourceManager.changeMultiplier(4);
                this.game.resourceManager.changePrestige(-1);
                break;
            default:
                break;
        }
        if(this.currentMultUpgrade < this.maxMultUgrades) { this.currentMultUpgrade++; }
        this.saveData();
    }

    getCurrentMultUpgrade(){
        return this.currentMultUpgrade;
    }
  
    saveData() {
      const data = {
        currentPowerUpgrade: this.currentPowerUpgrade,
        currentMultUpgrade: this.currentMultUpgrade,
      };
      localStorage.setItem('UpgradeData', JSON.stringify(data));
    }
  
    loadData() {
      const savedData = localStorage.getItem('UpgradeData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.currentPowerUpgrade = data.currentPowerUpgrade || 1;
        this.currentMultUpgrade = data.currentMultUpgrade || 1;
      }
    }
  }
  