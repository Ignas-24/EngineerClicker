export class Achievement {
    constructor(name, description, conditionFn, rewardFn) {
      this.name = name;
      this.description = description;
      this.conditionFn = conditionFn;
      this.rewardFn = rewardFn;
      this.unlocked = false;
    }
  
    check(game) {
      if (!this.unlocked && this.conditionFn(game)) {
        this.unlocked = true;
        this.rewardFn(game);
        alert(`Achievement Unlocked: ${this.name}`);
      }
    }

    createElement() {
        const wrap = document.createElement("div");
        wrap.className = "Achievement_wrap";
    
        const achievement = document.createElement("div");
        achievement.className = "Achievement";
    
        const title = document.createElement("p");
        title.textContent = this.name;
    
        const claimButton = document.createElement("button");
        claimButton.textContent = "Claim";
        claimButton.disabled = true; // Only enabled when unlocked
        claimButton.addEventListener("click", () => {
          if (this.unlocked && !this.claimed) {
            this.rewardFn(this.game);
            this.claimed = true;
            claimButton.disabled = true;
            claimButton.textContent = "Claimed!";
            wrap.classList.add("claimed");
          }
        });
    
        achievement.appendChild(title);
        achievement.appendChild(claimButton);
    
        const description = document.createElement("p");
        description.textContent = this.description;
    
        wrap.appendChild(achievement);
        wrap.appendChild(description);
    
        return wrap;
      }
  }