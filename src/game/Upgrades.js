export class Upgrades {
    game;
    powerUpgrades = [false, false, false, false];
    multUpgrades = [false, false, false];
    companyUpgrades = {
        reward: false, size: false, speed: false, biggerProjects: false, // Tier 1
        reward2: false, size2: false, speed2: false, biggerProjects2: false, // Tier 2
        reward3: false, size3: false, speed3: false, biggerProjects3: false, // Tier 3
    };

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
                this.game.resourceManager.changeEuros(-0.5);
                this.powerUpgrades[0] = true;
                success = true;
                break;
            case 2:
                if(this.powerUpgrades[1] === true) break;
                if(this.game.resourceManager.euro < 1) break;
                this.game.resourceManager.addClickPower(0.01);
                this.game.resourceManager.changeEuros(-1);
                this.powerUpgrades[1] = true;
                success = true;
                break;
            case 3:
                if(this.powerUpgrades[2] === true) break;
                if(this.game.resourceManager.euro < 5) break;
                this.game.resourceManager.addClickPower(0.02);
                this.game.resourceManager.changeEuros(-5);
                this.powerUpgrades[2] = true;
                success = true;
                break;
            case 4:
                if(this.powerUpgrades[3] === true) break;
                if(this.game.resourceManager.euro < 20) break;
                this.game.resourceManager.addClickPower(0.05);
                this.game.resourceManager.changeEuros(-20);
                this.powerUpgrades[3] = true;
                success = true;
                break;
            default:
                break;
        }
        this.game.notifyUpdate();
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
                if(this.multUpgrades[0] === false) break;
                if(this.game.resourceManager.prestige < 1) break;
                this.game.resourceManager.setMultiplier(3);
                this.game.resourceManager.changePrestige(-1);
                this.multUpgrades[1] = true;
                success = true;
                break;
            case 3:
                if(this.multUpgrades[2] === true) break;
                if(this.multUpgrades[1] === false) break;
                if(this.game.resourceManager.prestige < 1) break;
                this.game.resourceManager.setMultiplier(4);
                this.game.resourceManager.changePrestige(-1);
                this.multUpgrades[2] = true;
                success = true;
                break;
            default:
                break;
        }
        this.game.notifyUpdate();
        this.saveData();
        return success;
    }

    buyCompanyUpgrade(upgradeKey) {
        const upgradeCosts = {
            small: { reward: 1000, size: 3000, speed: 3000, biggerProjects: 5000 },
            medium: { reward2: 1000, size2: 3000, speed2: 10000, biggerProjects2: 2000 },
            large: { reward3: 1000, size3: 3000, speed3: 50000, biggerProjects3: 75000 },
        };

        const upkeepIncreases = { small: 100, medium: 250, large: 1000 };

        const companyType = this.game.companyManager.currentCompany?.type;
        if (!companyType || this.companyUpgrades[upgradeKey]) return false;

        let cost, upkeepIncrease;
        for (const type of ["small", "medium", "large"]) {
            if (upgradeCosts[type][upgradeKey] !== undefined) {
                cost = upgradeCosts[type][upgradeKey];
                upkeepIncrease = upkeepIncreases[type];
                break;
            }
            if (type === companyType) break;
        }

        if (!cost || this.game.resourceManager.euro < cost) return false;

        this.game.resourceManager.changeEuros(-cost);
        this.game.companyManager.currentCompany.upkeep += upkeepIncrease;
        this.companyUpgrades[upgradeKey] = true;

        this.saveData();
        this.game.notifyUpdate();
        return true;
    }

    resetCompanyUpgrades() {
        this.companyUpgrades = {
            reward: false, size: false, speed: false, biggerProjects: false,
            reward2: false, size2: false, speed2: false, biggerProjects2: false,
            reward3: false, size3: false, speed3: false, biggerProjects3: false,
        };
        this.saveData();
    }
  
    resetPowerUpgrades() {
        this.powerUpgrades = [false, false, false, false];
        this.saveData();
    }

    saveData() {
        const data = {
            powerUpgrades: this.powerUpgrades,
            multUpgrades: this.multUpgrades,
            companyUpgrades: this.companyUpgrades,
        };
        localStorage.setItem('UpgradeData', JSON.stringify(data));
    }

    loadData() {
        const savedData = localStorage.getItem('UpgradeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.powerUpgrades = data.powerUpgrades || [false, false, false, false];
            this.multUpgrades = data.multUpgrades || [false, false, false];
            this.companyUpgrades = data.companyUpgrades || {
                reward: false, size: false, speed: false, biggerProjects: false,
                reward2: false, size2: false, speed2: false, biggerProjects2: false,
                reward3: false, size3: false, speed3: false, biggerProjects3: false,
            };
        }
    }

    resetForBankruptcy() {
      this.powerUpgrades = [ false, false, false, false ];
      this.saveData();
    }
  }
