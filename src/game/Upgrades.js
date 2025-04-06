export class Upgrades {
    game;
    powerUpgrades = [ false, false, false, false ];
    multUpgrades = [ false, false, false ];
    
    constructor(game) {
      this.game = game;
      this.loadData();
    }

    powerUpgrade(upgradeIndex){
        let success = false;
        switch(upgradeIndex){
            case 1:
                if(this.powerUpgrades[0] === true) break
                if(this.game.resourceManager.euro < 0.5) break
                this.game.resourceManager.addClickPower(0.01);
                this.game.resourceManager.reduceEuros(0.5);
                this.powerUpgrades[0] = true;
                success = true;
                break;
            case 2:
                if(this.powerUpgrades[1] === true) break;
                if(this.game.resourceManager.euro < 1) break;
                this.game.resourceManager.addClickPower(0.01);
                this.game.resourceManager.reduceEuros(1);
                this.powerUpgrades[1] = true;
                success = true;
                break;
            case 3:
                if(this.powerUpgrades[2] === true) break;
                if(this.game.resourceManager.euro < 5) break;
                this.game.resourceManager.addClickPower(0.02);
                this.game.resourceManager.reduceEuros(5);
                this.powerUpgrades[2] = true;
                success = true;
                break;
            case 4:
                if(this.powerUpgrades[3] === true) break;
                if(this.game.resourceManager.euro < 20) break;
                this.game.resourceManager.addClickPower(0.05);
                this.game.resourceManager.reduceEuros(20);
                this.powerUpgrades[3] = true;
                success = true;
                break;
            default:
                break;
        }
        this.saveData();
        return success;
    }

    multUpgrade(upgradeIndex){
        let success = false;
        switch(upgradeIndex){
            case 1:
                if(this.multUpgrades[0] === true) break;
                if(this.game.resourceManager.prestige < 1) break;
                this.game.resourceManager.setMultiplier(2);
                this.game.resourceManager.changePrestige(-1);
                this.multUpgrades[0] = true;
                success = true;
                break;
            case 2:
                if(this.multUpgrades[1] === true) break;
                if(this.game.resourceManager.prestige < 1) break;
                this.game.resourceManager.setMultiplier(3);
                this.game.resourceManager.changePrestige(-1);
                this.multUpgrades[1] = 1;
                success = true;
                break;
            case 3:
                if(this.multUpgrades[2] === true) break;
                if(this.game.resourceManager.prestige < 1) break;
                this.game.resourceManager.setMultiplier(4);
                this.game.resourceManager.changePrestige(-1);
                this.multUpgrades[2] = true;
                success = true;
                break;
            default:
                break;
        }
        this.saveData();
        return success;
    }
  
    saveData() {
      const data = {
        powerUpgrades: this.powerUpgrades,
        multUpgrades: this.multUpgrades,
      };
      localStorage.setItem('UpgradeData', JSON.stringify(data));
    }
  
    loadData() {
      const savedData = localStorage.getItem('UpgradeData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.powerUpgrades = data.powerUpgrades || [ 0, 0, 0, 0 ];
        this.multUpgrades = data.multUpgrades || [ 0, 0, 0 ];
      }
    }
  }
  