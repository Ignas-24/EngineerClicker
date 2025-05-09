import React from "react";

const AchievementView = ({ achievement, game, onUpdate }) => {
  const { name, description, unlocked, claimed } = achievement;

  const handleClaim = () => {
    if (unlocked && !claimed) {
      achievement.claim(game);
      onUpdate();
    }
  };

  return (
    <div className={`Achievement_wrap`}>
      <div className="Achievement">
        <p>{name}</p>
        <button
          className="Achievement_button"
          onClick={handleClaim}
          disabled={!unlocked || claimed}
          style={{ backgroundColor: unlocked && !claimed ? "green" : "" }}
        >
          {claimed ? "Claimed!" : "Claim"}
        </button>
      </div>
      <p>{description}</p>
    </div>
  );
};

export default AchievementView;
