import React, { useState, useSyncExternalStore } from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";
import game from "../../game/Game";

const BottomLeft = () => {
  const [currentPowerUpgrade, setCurrentPowerUpgrade] = useState(game.upgrades.getCurrentPowerUpgrade());
  const [currentMultUpgrade, setCurrentMultUpgrade] = useState(game.upgrades.getCurrentMultUpgrade());

  const projectProgress = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.project.projectProgress
  );
  
  const [projectState, setProjectState] = useState("");

  React.useEffect(() => {
    setProjectState(
      game.project.isActive() ? `Active project progress: ${projectProgress.toFixed(2)}` : "No active project"
    );  
  }, [projectProgress, game.project.isActive()]);

  const handlePUpgradeClick = () => {
    game.upgrades.powerUpgrade();
    setCurrentPowerUpgrade(game.upgrades.getCurrentPowerUpgrade());
  };

  const handleMUpgradeClick = () => {
    game.upgrades.multUpgrade();
    setCurrentMultUpgrade(game.upgrades.getCurrentMultUpgrade());
  };

  const handleProjectClick = () => {
    game.project.changeActiveState();
    setProjectState(game.project.isActive() ? `Active project progress: ${projectProgress.toFixed(2)}` : "No active project");
  }

  return (
    <div className={styles.bottomLeft}>
      <Button label="Button 1" />
      <Button label="Button 2" />
      <Button label="Button 3" />
      <Button label={`Power Upgrade ${currentPowerUpgrade}`} onClick={handlePUpgradeClick} />
      <Button label={`Mult Upgrade ${currentMultUpgrade}`} onClick={handleMUpgradeClick} />
      <Button label={projectState} onClick={handleProjectClick} />
    </div>
  );
};

export default BottomLeft;
