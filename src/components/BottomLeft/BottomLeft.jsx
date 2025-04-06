import React, { useState, useSyncExternalStore } from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";
import game from "../../game/Game";
import PowerUpgradePopUp from "./PopUp/PowerUpgradePopUp";
import MultUpgradePopUp from "./PopUp/MultUpgradePopUp";

const BottomLeft = () => {
  const [isPowerOpen, setPowerOpen] = useState(false);
  const [isMultOpen, setMultOpen] = useState(false);

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

  const handleProjectClick = () => {
    game.project.changeActiveState();
    setProjectState(game.project.isActive() ? `Active project progress: ${projectProgress.toFixed(2)}` : "No active project");
  }

  return (
    <div className={styles.bottomLeft}>
      <Button label="Button 1" />
      <Button label="Button 2" />
      <Button label="Button 3" />
      <Button label="Open Power Upgrades" onClick={() => setPowerOpen(true)} />
      {isPowerOpen && <PowerUpgradePopUp onClose={() => setPowerOpen(false)} />}
      <Button label="Open Multiplier Upgrades" onClick={() => setMultOpen(true)} />
      {isMultOpen && <MultUpgradePopUp onClose={() => setMultOpen(false)} />}
      <Button label={projectState} onClick={handleProjectClick} />
    </div>
  );
};

export default BottomLeft;
