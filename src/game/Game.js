import { ResourceManager } from "./ResourceManager";
import { Upgrades } from "./Upgrades";
import { Project } from "./Project";
import { ProjectManager } from "./ProjectManager";

class Game {
  // Managers
  resourceManager;
  upgrades;
  project;
  projectManager;

  #listeners = []; // List of React components to notify

  constructor() {
    this.resourceManager = new ResourceManager(this);
    this.upgrades = new Upgrades(this);
    this.project = new Project(this);
    this.projectManager = new ProjectManager(this);
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
}

const game = new Game();
export default game;
