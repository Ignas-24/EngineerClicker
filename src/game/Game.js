import { ResourceManager } from "./ResourceManager";

class Game {
  // Managers
  resourceManager;

  #listeners = []; // List of React components to notify

  constructor() {
    this.resourceManager = new ResourceManager(this);
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
