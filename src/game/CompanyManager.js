export class CompanyManager {
  game;
  currentCompany = null;
  developers = { junior: 0, midlevel: 0, senior: 0, lead: 0 };
  upkeepInterval = null;
  projectContributionInterval = null;

  constructor(game) {
    this.game = game;
    this.loadData();
    this.startUpkeepTimer();
    this.startProjectContributionTimer();
    this.game.notifyUpdate();
  }

  startUpkeepTimer() {
    if (this.upkeepInterval) {
      clearInterval(this.upkeepInterval);
    }

    this.upkeepInterval = setInterval(
      () => {
        if (this.currentCompany) {
          const upkeepCost =
            this.currentCompany.upkeep + this.calculateDeveloperUpkeep();
          this.game.resourceManager.changeEuros(-upkeepCost);
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes
    this.game.notifyUpdate();
  }

  startProjectContributionTimer() {
    if (this.projectContributionInterval) {
      clearInterval(this.projectContributionInterval);
    }

    this.projectContributionInterval = setInterval(() => {
      const activeProject = this.game.project;
      if (activeProject && activeProject.isActive()) {
        activeProject.addProgressByDeveloper();
      }
    }, 1000); // Apply developer contributions every second
    this.game.notifyUpdate();
  }

  calculateDeveloperUpkeep() {
    const developerCosts = {
      junior: 100,
      midlevel: 200,
      senior: 500,
      lead: 1000,
    };

    return Object.entries(this.developers).reduce(
      (total, [tier, count]) => total + developerCosts[tier] * count,
      0,
    );
  }

  hireDeveloper(tier) {
    const totalEmployees = Object.values(this.developers).reduce(
      (sum, count) => sum + count,
      0,
    );
    if (totalEmployees >= this.currentCompany.maxEmployees) {
      alert("Maximum number of employees reached.");
      return false;
    }

    const developerTiers = {
      junior: { cost: 500, upkeep: 100, efficiency: 0.1 },
      midlevel: { cost: 1000, upkeep: 200, efficiency: 0.3 },
      senior: { cost: 2000, upkeep: 500, efficiency: 0.7 },
      lead: { cost: 5000, upkeep: 1000, efficiency: 1.5, boost: 0.1 },
    };

    const developer = developerTiers[tier];
    if (!developer) return false;

    if (this.game.resourceManager.euro >= developer.cost) {
      this.game.resourceManager.changeEuros(-developer.cost);
      this.developers[tier] += 1;
      this.saveData();
      this.game.notifyUpdate();
      return true;
    }

    return false;
  }

  calculateTotalEfficiency() {
    const developerTiers = {
      junior: { efficiency: 0.1, boost: 0.01 },
      midlevel: { efficiency: 0.3, boost: 0.03 },
      senior: { efficiency: 0.7, boost: 0.07 },
      lead: { efficiency: 1.5, boost: 0 }, // Lead developers don't boost themselves
    };

    let totalEfficiency = Object.entries(this.developers).reduce(
      (total, [tier, count]) =>
        total + (developerTiers[tier]?.efficiency || 0) * count,
      0,
    );

    // Apply lead developer boost
    const leadCount = this.developers.lead;
    if (leadCount > 0) {
      totalEfficiency += Object.entries(this.developers).reduce(
        (boostTotal, [tier, count]) => {
          const boost = developerTiers[tier]?.boost || 0;
          return boostTotal + boost * count * leadCount;
        },
        0,
      );
    }

    // Apply speed upgrades
    const upgrades = this.game.upgrades.companyUpgrades;
    if (upgrades.speed || upgrades.speed2 || upgrades.speed3) {
      const speedMultiplier =
        1 *
        (upgrades.speed ? 1.2 : 1) *
        (upgrades.speed2 ? 1.2 : 1) *
        (upgrades.speed3 ? 1.2 : 1);
      totalEfficiency *= speedMultiplier;
    }

    return totalEfficiency;
  }

  stopUpkeepTimer() {
    if (this.upkeepInterval) {
      clearInterval(this.upkeepInterval);
      this.upkeepInterval = null;
    }
    this.game.notifyUpdate();
  }

  stopProjectContributionTimer() {
    if (this.projectContributionInterval) {
      clearInterval(this.projectContributionInterval);
      this.projectContributionInterval = null;
    }
    this.game.notifyUpdate();
  }

  buyCompany(type) {
    const { euro } = this.game.resourceManager;
    const completedProjectsThisReset =
      this.game.projectManager.completedProjectsThisReset;

    const companyTypes = {
      small: {
        cost: 5000,
        maxEmployees: 5 + Math.floor(completedProjectsThisReset / 5),
        upkeep: 300,
        unlocks: ["junior", "midlevel"],
        requirements: () => !this.currentCompany,
      },
      medium: {
        cost: 20000,
        maxEmployees: 20 + Math.floor(completedProjectsThisReset / 3),
        upkeep: 1000,
        unlocks: ["junior", "midlevel", "senior"],
        requirements: () =>
          this.currentCompany?.type === "small" &&
          completedProjectsThisReset >= 20,
      },
      large: {
        cost: 100000,
        maxEmployees: 75 + completedProjectsThisReset,
        upkeep: 5000,
        unlocks: ["junior", "midlevel", "senior", "lead"],
        requirements: () =>
          this.currentCompany?.type === "medium" &&
          completedProjectsThisReset >= 50,
      },
    };

    const company = companyTypes[type];
    if (!company) return false;

    if (euro >= company.cost && company.requirements()) {
      this.game.resourceManager.changeEuros(-company.cost);
      this.currentCompany = { type, ...company };
      this.saveData();
      this.game.notifyUpdate();
      this.game.stats.increment("Companies", 1);
      this.game.achievementManager.checkAchievements();
      return true;
    }

    return false;
  }

  buyUpgrade(upgradeKey) {
    return this.game.upgrades.buyCompanyUpgrade(upgradeKey);
  }

  sellCompany() {
    if (!this.currentCompany) return false;

    const completedProjectsThisReset =
      this.game.projectManager.completedProjectsThisReset;
    const totalEmployees = Object.values(this.developers).reduce(
      (sum, count) => sum + count,
      0,
    );

    const projectReward = completedProjectsThisReset * 500;
    const employeeReward = totalEmployees * 500;
    const totalReward = projectReward + employeeReward;

    // Add the money before calculating prestige points
    this.game.resourceManager.changeEuros(totalReward);

    // Calculate prestige points
    const balance = this.game.resourceManager.euro;
    const prestigePoints = Math.floor(Math.sqrt(balance / 20000));
    this.game.resourceManager.changePrestige(prestigePoints);

    // Reset company data
    this.currentCompany = null;
    this.developers = { junior: 0, midlevel: 0, senior: 0, lead: 0 };

    // Reset upgrades
    this.game.upgrades.resetCompanyUpgrades();
    this.game.upgrades.resetPowerUpgrades();

    // Reset projects
    this.game.projectManager.selectProjects();
    this.game.projectManager.completedProjectsThisReset = 0;

    // Reset resources
    this.game.resourceManager.euro = 0;
    this.game.resourceManager.saveData();

    this.game.stats.increment("CompaniesSold", 1);
    this.game.achievementManager.checkAchievements();

    this.saveData();
    this.game.notifyUpdate();

    alert(
      `Company sold for ${balance.toPrecision(2)} € and gained ${prestigePoints.toPrecision(2)} prestige points!`,
    );
    return true;
  }

  saveData() {
    const data = {
      currentCompany: this.currentCompany,
      developers: this.developers,
    };
    localStorage.setItem("CompanyManagerData", JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem("CompanyManagerData");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.currentCompany = data.currentCompany;
      this.developers = data.developers || {
        junior: 0,
        midlevel: 0,
        senior: 0,
        lead: 0,
      };
    }
    this.game.notifyUpdate();
  }

  resetForBankruptcy() {
    if (this.currentCompany != null) {
      this.game.stats.set("FinancialRuin", 1);
      this.game.stats.set("CompaniesSold", 0);
      this.game.achievementManager.checkAchievements();
      this.game.upgrades.resetCompanyUpgrades();
      this.currentCompany = null;
      this.developers = { junior: 0, midlevel: 0, senior: 0, lead: 0 };
      this.saveData();
      this.game.notifyUpdate();
    }
  }
}
