import React from "react";

const AchievementView = ({ achievement, onClick }) => {
  const { name, description, unlocked, claimed } = achievement;

  return (
    <div className={`Achievement_wrap`}>
      <div className="Achievement">
        <p>{name}</p>
        <button
          className="Achievement_button"
          onClick={() => {
            onClick(achievement);
          }}
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
