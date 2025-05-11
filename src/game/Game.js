import { ResourceManager } from "./ResourceManager";
import { Upgrades } from "./Upgrades";
import { Project } from "./Project";
import { ProjectManager } from "./ProjectManager";
import { LoanManager } from "./LoanManager";
import { CompanyManager } from "./CompanyManager";
import { Stats } from "./Stat_tracker";
import { AchievementManager } from "./AchievementManager";

class Game {
  // Managers
  resourceManager;
  upgrades;
  project;
  projectManager;
  loanManager;
  companyManager;
  stats;
  achievementManager;
  
  #listeners = []; // List of React components to notify

  constructor() {
    this.resourceManager = new ResourceManager(this);
    this.upgrades = new Upgrades(this);
    this.project = new Project(this);
    this.projectManager = new ProjectManager(this);
    this.loanManager = new LoanManager(this);
    this.companyManager = new CompanyManager(this);
    this.stats = new Stats(this);
    this.achievementManager = new AchievementManager(this);
  }

  // Subcribe and notify React components
  subscribe(listener) {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  }

  notifyUpdate() {
    this.#listeners.forEach((listener) => listener());
  }

  resetForBankruptcy() {
    this.resourceManager.resetForBankruptcy();
    if(this.project) this.project.resetForBankruptcy();
    this.upgrades.resetForBankruptcy();
    this.projectManager.resetForBankruptcy();
    this.notifyUpdate();
  }
}

const game = new Game();
export default game;
