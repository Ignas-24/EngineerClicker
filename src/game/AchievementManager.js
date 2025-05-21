import { Achievement } from "../components/BottomLeft/Achievements/Achievement";

export class AchievementManager {
  game;
  achievements = [];

  constructor(game) {
    this.game = game;
    this.achievements = [];
    this.loadAchievements();
    this.game.notifyUpdate();
  }

  createDefaultAchievements() {
    return [
      new Achievement(
        "Welcome to the workforce!",
        (requirement) => `Complete ${requirement} projects`,
        (game, requirement) =>
          game.stats.get("projectsFinished") >= requirement,
        (game) => {
          game.resourceManager.changePrestige(1);
        },
        {
          scalable: true,
          requirement: 10,
          multiplier: 2,
        },
      ),
      new Achievement(
        "Business boom",
        "Establish a company",
        (game) => game.stats.get("Companies") >= 1,
        (game) => {
          game.resourceManager.changePrestige(1);
        },
        {
          scalable: false,
        },
      ),
      new Achievement(
        "Financial ruin",
        "Default on your payments while paying off a loan and managing a company",
        (game) => game.stats.get("FinancialRuin")>=1,
        (game) => {
          game.resourceManager.changePrestige(1);
        },
      ),
      new Achievement(
        "Game’s too easy",
        "Sell your company 5 times in a row",
        (game, requirement) => game.stats.get("CompaniesSold") >= requirement,
        (game) => {
          game.resourceManager.changePrestige(1);
        },
        {
          scalable: true,
          requirement: 5,
          multiplier: 2,
        },
      ),
      new Achievement(
        "Almost like a real job",
        "Click the computer 10 thousand times",
        (game, requirement) => game.stats.get("Clicks") >= requirement,
        (game) => {
          game.resourceManager.changePrestige(1);
        },
        {
          scalable: true,
          requirement: 10000,
          multiplier: 10,
        },
      ),
      new Achievement(
        "Calculated risk",
        "Take the largest possible loan",
        (game) => game.stats.get("MaxLoans") >= 1,
        (game) => {
          game.resourceManager.changePrestige(1);
        },
      ),
      new Achievement(
        "Tech-business guru",
        (requirement) => `Acquire ${requirement} euros`,
        (game, requirement) => game.resourceManager.euro >= requirement,
        (game) => {
          game.resourceManager.changePrestige(1);
        },
        {
          scalable: true,
          requirement: 1000000,
          multiplier: 10,
        },
      ),
    ];
  }

  saveAchievements() {
    const saveData = this.achievements.map((ach) => ({
      name: ach.name,
      unlocked: ach.unlocked,
      claimed: ach.claimed || false,
      multiplier: ach.multiplier,
      requirement: ach.requirement,
      increment: ach.increment,
      description: ach._description,
      scalable: ach.scalable,
    }));
    localStorage.setItem("AchievementsData", JSON.stringify(saveData));
  }

  loadAchievements() {
    const saved = localStorage.getItem("AchievementsData");
    if (saved) {
      const parsed = JSON.parse(saved);

      const defaultAchievements = this.createDefaultAchievements();

      parsed.forEach((savedAch) => {
        const match = defaultAchievements.find((a) => a.name === savedAch.name);
        if (match) {
          if (savedAch.scalable === true) {
            match.multiplier = savedAch.multiplier;
            match.requirement = savedAch.requirement;
            match.increment = savedAch.increment;
          }

          match.unlocked = savedAch.unlocked;
          match.claimed = savedAch.claimed || false;
        }
      });

      this.achievements = defaultAchievements;
    } else {
      this.achievements = this.createDefaultAchievements();

      this.saveAchievements();
    }

    this.game.notifyUpdate();
  }

  checkAchievements() {
    let changed = false;
    this.achievements.forEach((achievement) => {
      const wasUnlocked = achievement.unlocked;
      achievement.check(this.game);
      if (!wasUnlocked && achievement.unlocked) {
        changed = true;
      }
    });

    if (changed) {
      this.saveAchievements();
    }
  }

  getAchievements() {
    return this.achievements;
  }
}
