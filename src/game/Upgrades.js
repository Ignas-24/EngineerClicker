export class Upgrades {
  game;
  powerUpgrades = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  multUpgrades = [false, false, false];
  companyUpgrades = {
    reward: false,
    size: false,
    speed: false,
    biggerProjects: false, // Tier 1
    reward2: false,
    size2: false,
    speed2: false,
    biggerProjects2: false, // Tier 2
    reward3: false,
    size3: false,
    speed3: false,
    biggerProjects3: false, // Tier 3
  };

  powerUpgradeData = [
    { id: 1, price: 0.5, power: 0.01 },
    { id: 2, price: 1.0, power: 0.01 },
    { id: 3, price: 5.0, power: 0.02 },
    { id: 4, price: 20.0, power: 0.05 },
    { id: 5, price: 50.0, power: 0.1 },
    { id: 6, price: 125.0, power: 0.2 },
    { id: 7, price: 300.0, power: 0.35 },
    { id: 8, price: 750.0, power: 0.6 },
    { id: 9, price: 1800.0, power: 1.0 },
    { id: 10, price: 4500.0, power: 1.75 },
    { id: 11, price: 10000.0, power: 3.0 },
    { id: 12, price: 25000.0, power: 5.0 },
    { id: 13, price: 60000.0, power: 8.0 },
  ];

  multiplierUpgradeData = [
    { id: 1, price: 1.0, multiplier: 2, requires: null },
    { id: 2, price: 1.0, multiplier: 3, requires: 1 },
    { id: 3, price: 1.0, multiplier: 4, requires: 2 },
  ];

  companyUpgradeData = {
    small: { reward: 1000, size: 3000, speed: 3000, biggerProjects: 5000 },
    medium: {
      reward2: 1000,
      size2: 3000,
      speed2: 10000,
      biggerProjects2: 2000,
    },
    large: {
      reward3: 1000,
      size3: 3000,
      speed3: 50000,
      biggerProjects3: 75000,
    },
  };

  upkeepIncreases = { small: 100, medium: 250, large: 1000 };

  constructor(game) {
    this.game = game;
    this.loadData();
    this.game.notifyUpdate();
  }

  powerUpgrade(upgradeIndex) {
    if (upgradeIndex < 1 || upgradeIndex > this.powerUpgradeData.length)
      return false;

    const index = upgradeIndex - 1;
    const upgrade = this.powerUpgradeData[index];

    // Check if already purchased
    if (this.powerUpgrades[index]) return false;

    // Check if enough resources
    if (this.game.resourceManager.euro < upgrade.price) return false;

    // Apply effect
    this.game.resourceManager.addClickPower(upgrade.power);
    this.game.resourceManager.changeEuros(-upgrade.price);
    this.powerUpgrades[index] = true;

    this.game.notifyUpdate();
    this.saveData();
    return true;
  }

  multUpgrade(upgradeIndex) {
    if (upgradeIndex < 1 || upgradeIndex > this.multiplierUpgradeData.length)
      return false;

    const index = upgradeIndex - 1;
    const upgrade = this.multiplierUpgradeData[index];

    // Check if already purchased
    if (this.multUpgrades[index]) return false;

    // Check prerequisites
    if (upgrade.requires !== null && !this.multUpgrades[upgrade.requires - 1])
      return false;

    // Check if enough resources
    if (this.game.resourceManager.prestige < upgrade.price) return false;

    // Apply effect
    this.game.resourceManager.setMultiplier(upgrade.multiplier);
    this.game.resourceManager.changePrestige(-upgrade.price);
    this.multUpgrades[index] = true;

    this.game.notifyUpdate();
    this.saveData();
    return true;
  }

  buyCompanyUpgrade(upgradeKey) {
    const companyType = this.game.companyManager.currentCompany?.type;
    if (!companyType || this.companyUpgrades[upgradeKey]) return false;

    let cost, upkeepIncrease;
    for (const type of ["small", "medium", "large"]) {
      if (this.companyUpgradeData[type][upgradeKey] !== undefined) {
        cost = this.companyUpgradeData[type][upgradeKey];
        upkeepIncrease = this.upkeepIncreases[type];
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
      reward: false,
      size: false,
      speed: false,
      biggerProjects: false,
      reward2: false,
      size2: false,
      speed2: false,
      biggerProjects2: false,
      reward3: false,
      size3: false,
      speed3: false,
      biggerProjects3: false,
    };
    this.saveData();
    this.game.notifyUpdate();
  }

  resetPowerUpgrades() {
    this.powerUpgrades = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];
    this.saveData();
    this.game.notifyUpdate();
  }

  saveData() {
    const data = {
      powerUpgrades: this.powerUpgrades,
      multUpgrades: this.multUpgrades,
      companyUpgrades: this.companyUpgrades,
    };
    localStorage.setItem("UpgradeData", JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem("UpgradeData");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.powerUpgrades = data.powerUpgrades || [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      this.multUpgrades = data.multUpgrades || [false, false, false];
      this.companyUpgrades = data.companyUpgrades || {
        reward: false,
        size: false,
        speed: false,
        biggerProjects: false,
        reward2: false,
        size2: false,
        speed2: false,
        biggerProjects2: false,
        reward3: false,
        size3: false,
        speed3: false,
        biggerProjects3: false,
      };
    }
    this.game.notifyUpdate();
  }

  resetForBankruptcy() {
    this.powerUpgrades = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];
    this.saveData();
    this.game.notifyUpdate();
  }
}
