export class Stats{
    
    game;
    stats = {}

    constructor(game) {
        this.game=game;
        this.load();
      }
    
      increment(statKey, amount) {
        if(!amount)
        {
          amount=1;
        }
        if (!this.stats[statKey]) {
          this.stats[statKey] = 0;
        }
        this.stats[statKey] += amount;
        this.save();
      }
    
      set(statKey, value) {
        this.stats[statKey] = value;
        this.save();
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
      }
}