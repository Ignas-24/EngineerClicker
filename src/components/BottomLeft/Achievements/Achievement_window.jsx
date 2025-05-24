import React, { useSyncExternalStore } from "react";
import "./Achievement_window.css";
import AchievementView from "./AchievementView";
import game from "../../../game/Game";
import getCached from "../../../util/getCached";

const Achievement_window = ({ onClick }) => {
  const achievements = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() =>
      game.achievementManager.getAchievements().map((a, i) => ({
        id: i,
        name: a.name,
        description: a.description,
        unlocked: a.unlocked,
        claimed: a.claimed,
      })),
    ),
  );

  const handleClaim = (achievement) => {
    if (achievement.unlocked && !achievement.claimed) {
      game.achievementManager.getAchievements()[achievement.id].claim(game);
    }
  };
  return (
    <div className="Backdrop">
      <div className="nes-container is-rounded Window_Container">
        <button className="nes-btn is-error closeButton" onClick={onClick}>
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
