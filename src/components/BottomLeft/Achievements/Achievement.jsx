//logic component
export class Achievement {
  constructor(name, description, conditionFn, rewardFn, scalability = {}) {
    this.name = name;
    this._description = description;
    this.conditionFn = conditionFn;
    this.rewardFn = rewardFn;
    this.unlocked = false;
    this.claimed = false;

    this.requirement = scalability.requirement || null;
    this.multiplier = scalability.multiplier || null;
    this.increment = scalability.increment || null;
    this.scalable = scalability.scalable;
  }

  get description() {
    if (typeof this._description === "function") {
      return this._description(this.requirement);
    } else {
      return this._description;
    }
  }

  check(game) {
    if (!this.unlocked && this.conditionFn(game, this.requirement)) {
      this.unlocked = true;
      alert(`Achievement Unlocked: ${this.name}`);
    }
  }

  claim(game) {
    if (this.unlocked && !this.claimed) {
      this.rewardFn(game);
      this.claimed = true;
    }

    if (this.scalable) {
      if (this.multiplier) {
        this.requirement = this.requirement * this.multiplier;
      } else {
        this.requirement = this.requirement + this.increment;
      }
      this.unlocked = false;
      this.claimed = false;
    }
    console.log("Sukurtas scalable naujas");
    game.achievementManager.saveAchievements();
    console.log(this);
  }
}
