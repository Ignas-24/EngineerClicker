import React, { useSyncExternalStore } from "react";
import { useState } from "react";
import "./Achievement_window.css";
import AchievementView from "./AchievementView";
import game from "../../../game/Game";
import getCached from "../../../util/getCached";

const Achievement_window = ({ onClick }) => {
  // TODO: 
  const achievements = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() =>
      game.achievementManager.getAchievements().map((a) => ({
        name: a.name,
        description: a.description,
        unlocked: a.unlocked,
        claimed: a.claimed,
      }))
    )
  );

  const handleClaim = (achievement) => {
    if (unlocked && !claimed) {
      achievement.claim(game);
    }
  };

  console.log(achievements);
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
            onClick={handleClaim}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievement_window;
