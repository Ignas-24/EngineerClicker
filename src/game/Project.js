export class Project {
    game;
    projectProgress = 0;
    active = false;

    constructor(game) {
      this.game = game;
      this.loadData();
    }

    isActive() {
      return this.active;
    }

    changeActiveState() {
      this.active = !this.active;
      this.saveData();
    }

    addProgress() {
        const delta = parseFloat((this.game.resourceManager.clickPower * this.game.resourceManager.multiplier).toFixed(2));
        this.projectProgress = parseFloat((this.projectProgress + delta).toFixed(2));
        this.saveData();
        this.game.notifyUpdate();
    }

    saveData() {
      const data = {
        projectProgress: this.projectProgress,
        isActive: this.active,
      };
      localStorage.setItem('ProjectData', JSON.stringify(data));
    }

    loadData() {
      const savedData = localStorage.getItem('ProjectData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.projectProgress = data.projectProgress || 0;
        this.active = data.isActive || false;
      }
    }

    resetForBankruptcy() {
      this.projectProgress = 0;
      this.active = false;
      this.saveData();
    }
  }
