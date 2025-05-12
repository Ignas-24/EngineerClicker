export class Stats {
  game;
  stats = {};

  constructor(game) {
    this.game = game;
    this.load();
    this.game.notifyUpdate();
  }

  increment(statKey, amount) {
    if (!amount) {
      amount = 1;
    }
    if (!this.stats[statKey]) {
      this.stats[statKey] = 0;
    }
    this.stats[statKey] += amount;
    this.save();
    this.game.notifyUpdate();
  }

  set(statKey, value) {
    this.stats[statKey] = value;
    this.save();
    this.game.notifyUpdate();
  }

  get(statKey) {
    return this.stats[statKey] || 0;
  }

  save() {
    localStorage.setItem("StatTrackerData", JSON.stringify(this.stats));
  }

  load() {
    const data = localStorage.getItem("StatTrackerData");
    if (data) {
      this.stats = JSON.parse(data);
    }
    this.game.notifyUpdate();
  }
}
