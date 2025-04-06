import { Project } from "./Project";

export class ProjectManager {
  game;
  smallProject = { sizeInterval: [5, 12], rewardInterval: [2, 8], deadlineInterval: [50, 100] };
  mediumProject = { sizeInterval: [10, 50], rewardInterval: [2, 5], deadlineInterval: [80, 180] };
  largeProject = { sizeInterval: [30, 200], rewardInterval: [2, 4], deadlineInterval: [120, 180] };
  selectedProjects = [];
  cooldown = 0;
  timerInterval = null;
  projectRegistry = {};
  completedProjectsThisReset = 0;
  completedProjectTotal = 0;

  constructor(game) {
    this.game = game;
    this.loadData();
    if (this.selectedProjects.length === 0) {
      this.selectProjects();
    }
  }

  getRandomInt(min, max) {
    if (min > max) {
      throw new Error("Invalid range: min should be less than or equal to max");
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }

  getRandomProjectName() {
    let projectName = "Project " + this.getRandomLetter() + this.getRandomLetter() + this.getRandomLetter() + this.getRandomInt(1, 1000);
    return projectName;
  }

  createProject(sizeInterval, rewardInterval, deadlineInterval) {
    const upgrades = this.game.upgrades.companyUpgrades;

    // Apply bigger projects upgrade
    if (upgrades.biggerProjects || upgrades.biggerProjects2 || upgrades.biggerProjects3) {
      const sizeIncreaseMultiplier = 1 *
        (upgrades.biggerProjects ? 2 : 1) * 
        (upgrades.biggerProjects2 ? 2 : 1) * 
        (upgrades.biggerProjects3 ? 2 : 1);
      sizeInterval = [
        Math.ceil(sizeInterval[0] * sizeIncreaseMultiplier),
        Math.ceil(sizeInterval[1] * sizeIncreaseMultiplier),
      ];
    }

    let size = this.getRandomInt(sizeInterval[0], sizeInterval[1]);

    // Apply reward increase upgrades
    if (upgrades.reward || upgrades.reward2 || upgrades.reward3) {
      const rewardIncreaseMultiplier = 1 +
        (upgrades.reward ? 0.1 : 0) +
        (upgrades.reward2 ? 0.1 : 0) +
        (upgrades.reward3 ? 0.1 : 0);
      rewardInterval = [
        Math.ceil(rewardInterval[0] * rewardIncreaseMultiplier),
        Math.ceil(rewardInterval[1] * rewardIncreaseMultiplier),
      ];
    }

    let reward = this.getRandomInt(rewardInterval[0], rewardInterval[1]) * size;

    // Apply size reduction upgrades
    if (upgrades.size || upgrades.size2 || upgrades.size3) {
      const sizeReductionMultiplier = 1 -
        (upgrades.size ? 0.05 : 0) -
        (upgrades.size2 ? 0.05 : 0) -
        (upgrades.size3 ? 0.05 : 0);
      size = Math.ceil(size * sizeReductionMultiplier); // Apply the reduction after the reward calculation
    }

    let deadline = this.getRandomInt(deadlineInterval[0], deadlineInterval[1]);
    let projectName = this.getRandomProjectName();
    const project = new Project(this.game, size, reward, deadline, projectName);
    this.projectRegistry[project.dataName] = project;
    project.saveData();

    return project;
  }

  generateProjectPool() {
    const projectPool = {
      small: Array.from({ length: 4 }, () => this.createProject(this.smallProject.sizeInterval, this.smallProject.rewardInterval, this.smallProject.deadlineInterval)),
      medium: Array.from({ length: 4 }, () => this.createProject(this.mediumProject.sizeInterval, this.mediumProject.rewardInterval, this.mediumProject.deadlineInterval)),
      large: Array.from({ length: 4 }, () => this.createProject(this.largeProject.sizeInterval, this.largeProject.rewardInterval, this.largeProject.deadlineInterval)),
    };
    return projectPool;
  }

  calculateEstimatedProgress(projectDeadline) {
    const expectedProgress = this.game.resourceManager.clickPower * this.game.resourceManager.multiplier * 5 * projectDeadline;
    return expectedProgress;
  }

  calculateProjectWeight(expectedProgress, projectSize) {
    if (expectedProgress <= 0 || projectSize <= 0) {
      throw new Error("expectedProgress and projectSize must be positive values");
    }
    return 1.0 / (1.0 + Math.abs(Math.log(expectedProgress / projectSize) / Math.log(1.2)));
  }

  selectProjects() {
    if (this.cooldown > 0) return;

    if (this.selectedProjects.some(project => project.active)) {
      const activeProjects = this.selectedProjects.filter(project => project.active);
      const inactiveCount = 4 - activeProjects.length;

      const projectPool = this.generateProjectPool();
      const allProjects = Object.values(projectPool).flat();

      const weightedProjects = allProjects.map(project => {
        const expectedProgress = this.calculateEstimatedProgress(project.projectDeadline);
        const weight = this.calculateProjectWeight(expectedProgress, project.projectSize);
        return { project, key: -Math.log(Math.random()) / weight };
      });

      weightedProjects.sort((a, b) => a.key - b.key);

      const newProjects = weightedProjects.slice(0, inactiveCount).map(item => item.project);

      this.selectedProjects = this.selectedProjects.map(project =>
        project.active ? project : newProjects.shift()
      );
    } else {
      const projectPool = this.generateProjectPool();
      const allProjects = Object.values(projectPool).flat();

      const weightedProjects = allProjects.map(project => {
        const expectedProgress = this.calculateEstimatedProgress(project.projectDeadline);
        const weight = this.calculateProjectWeight(expectedProgress, project.projectSize);
        return { project, key: -Math.log(Math.random()) / weight };
      });

      weightedProjects.sort((a, b) => a.key - b.key);
      this.selectedProjects = weightedProjects.slice(0, 4).map(item => item.project);
    }
    this.saveData();
  }


  removeProject(inactiveProject) {
    this.selectedProjects = this.selectedProjects.filter(
      (project) => project.dataName !== inactiveProject.dataName
    );
    this.saveData();
    this.game.notifyUpdate();
  }

  startTimer(currentCooldown) {
    this.cooldown = currentCooldown;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (this.cooldown <= 0) {
        clearInterval(this.timerInterval);
        this.game.notifyUpdate();
      } else {
        this.cooldown--;
        this.saveData();
        this.game.notifyUpdate();
      }
    }, 1000);
  }

  saveData() {
    const projectKeys = this.selectedProjects.map(project => project.dataName);
    const data = {
      selectedProjectKeys: projectKeys,
      cooldown: this.cooldown,
      completedProjectsThisReset: this.completedProjectsThisReset,
      completedProjectTotal: this.completedProjectTotal,
    };
    localStorage.setItem("ProjectManagerData", JSON.stringify(data));
  }

  loadData() {
    const savedData = localStorage.getItem("ProjectManagerData");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.completedProjectsThisReset = data.completedProjectsThisReset || 0;
      this.completedProjectTotal = data.completedProjectTotal || 0;
      const projectKeys = data.selectedProjectKeys || [];

      this.selectedProjects = projectKeys.map(key => {
        const projectData = localStorage.getItem(`${key}Data`);
        if (projectData) {
          const parsedData = JSON.parse(projectData);
          const project = new Project(
            this.game,
            parsedData.projectSize,
            parsedData.projectReward,
            parsedData.projectDeadline,
            parsedData.projectName,
            key
          );
          project.projectProgress = parsedData.projectProgress;
          project.remainingTime = parsedData.remainingTime;
          project.completed = parsedData.completed;
          project.failed = parsedData.failed;
          project.active = parsedData.isActive;
          this.projectRegistry[key] = project;
          return project;
        }
        return undefined;
      }).filter(project => project !== undefined);

      this.cooldown = data.cooldown || 0;
      this.startTimer(this.cooldown);
    }
  }
}
