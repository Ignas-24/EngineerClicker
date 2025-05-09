export class Project {
  game;
  projectName;
  projectSize;
  projectProgress = 0;
  projectReward;
  projectDeadline;
  remainingTime;
  timerInterval = null; 
  TIMER_PERIOD_MS = 1000;
  active = false;
  completed = false;
  failed = false;

  dataName;

  constructor(game, projectSize, projectReward, projectDeadline, projectName, dataName) {
    this.game = game;
    this.projectSize = projectSize;
    this.projectReward = projectReward;
    this.projectDeadline = projectDeadline;
    this.projectName = projectName;
    this.remainingTime = projectDeadline;
    this.dataName = dataName || (typeof this.projectName === 'string'
      ? `${this.projectName.replace(/ /g, "_")}_${Date.now()}`
      : 'Project');
    this.loadData();
  }

  isActive() {
    return this.active;
  }

  toggleActive() {
    if (!this.active) {
      this.active = true;
      this.startTimer();
    } else {
      this.active = false;
      this.projectProgress = 0;
      this.remainingTime = this.projectDeadline;
      this.stopTimer();
    }
    this.saveData();
    this.game.notifyUpdate();
  }

  addProgress() {
    if (!this.active) return;
    const delta = this.game.resourceManager.clickPower * this.game.resourceManager.multiplier;
    this.projectProgress += delta;
    this.checkCompletion();
    if(!this.completed) {
      this.saveData();
    }
    this.game.notifyUpdate();
  }
  addProgressByDeveloper() {
    if (!this.active) return;
    const delta = this.game.companyManager.calculateTotalEfficiency();
    this.projectProgress += delta;
    this.checkCompletion();
    if(!this.completed) {
      this.saveData();
    }
    this.game.notifyUpdate();
  }

  checkCompletion() {
    if (this.projectProgress >= this.projectSize) {
      this.completed = true;
      this.active = false;
      this.game.projectManager.completedProjectsThisReset++;
      this.game.projectManager.completedProjectTotal++;
      this.stopTimer();
      this.game.resourceManager.changeEuros(this.projectReward);
      this.game.projectManager.removeProject(this);
      this.game.notifyUpdate();
    }
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.onTimerComplete();
      } else {
        this.remainingTime -= this.TIMER_PERIOD_MS / 1000;
        this.saveData();
        this.game.notifyUpdate();
      }
    }, this.TIMER_PERIOD_MS);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onTimerComplete() {
    if (!this.completed) {
      this.failed = true;
      this.active = false;
      this.stopTimer();
      alert(`Project ${this.projectName} failed`);
      this.game.projectManager.removeProject(this);
      this.saveData();
      this.game.notifyUpdate();
    }
  }


  saveData() {
    const data = {
      projectName: this.projectName,
      projectSize: this.projectSize,
      projectProgress: this.projectProgress,
      projectReward: this.projectReward,
      projectDeadline: this.projectDeadline,
      remainingTime: this.remainingTime,
      completed: this.completed,
      failed: this.failed,
      isActive: this.active,
    };
    localStorage.setItem(`${this.dataName}Data`, JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem(`${this.dataName}Data`);
    if (savedData) {
      const data = JSON.parse(savedData);
      this.projectName = data.projectName || this.projectName;
      this.projectSize = data.projectSize || this.projectSize;
      this.projectProgress = data.projectProgress || 0;
      this.projectReward = data.projectReward || this.projectReward;
      this.projectDeadline = data.projectDeadline || this.projectDeadline;
      this.remainingTime = data.remainingTime || this.projectDeadline;
      this.completed = data.completed || false;
      this.failed = data.failed || false;
      this.active = data.isActive || false;
    }
  }

  deleteData() {
    localStorage.removeItem(`${this.dataName}Data`);
  }

  resetForBankruptcy() {
    clearInterval(this.timerInterval);
    this.projectProgress = 0;
    this.projectSize = 0;
    this.remainingTime = 0;
    this.active = false;
    this.saveData();
  }
}