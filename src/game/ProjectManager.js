export class ProjectManager {
    game;
  
    constructor(game) {
      this.game = game;
    }
  
    calculateProjectWeight(expectedProgress, projectSize) {
        if (expectedProgress <= 0 || projectSize <= 0) {
            throw new Error("expectedProgress and projectSize must be positive values");
        }
        return 1.0 / (1.0 + Math.abs(Math.log(expectedProgress / projectSize) / Math.log(1.2)))
    }
  }
  