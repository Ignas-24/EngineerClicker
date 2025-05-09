import React from "react";
import { useState } from "react";
import "./Achievement_window.css";
import AchievementView from "./AchievementView";

const Achievement_window = ({ onClick, game }) => {
  const [, forceUpdate] = useState(false);
  const achievements = game.achievementManager.getAchievements();
  console.log(achievements);
  const refresh = () => {
    forceUpdate((v) => !v);
    game.achievementManager.saveAchievements();
  };

  return (
    <div className="Backdrop">
      <div className="Window_Container">
        <button className="closeButton" onClick={onClick}>
          X
        </button>

        {achievements.map((achievement, index) => (
          <AchievementView
            key={index}
            achievement={achievement}
            game={game}
            onUpdate={refresh}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievement_window;
