import React, { useState, useSyncExternalStore } from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";
import game from "../../game/Game";
import PowerUpgradePopUp from "./PopUp/PowerUpgradePopUp";
import MultUpgradePopUp from "./PopUp/MultUpgradePopUp";
import ProjectSelectPopUp from "./PopUp/ProjectSelectPopUp";

const BottomLeft = () => {
  const [isPowerOpen, setPowerOpen] = useState(false);
  const [isMultOpen, setMultOpen] = useState(false);
  const [isProjectOpen, setProjectOpen] = useState(false);

  return (
    <div className={styles.bottomLeft}>
      <Button label="Button 1" />
      <Button label="Button 2" />
      <Button label="Button 3" />
      <Button label="Open Power Upgrades" onClick={() => setPowerOpen(!isPowerOpen)} />
      {isPowerOpen && <PowerUpgradePopUp onClose={() => setPowerOpen(false)} />}
      <Button label="Open Multiplier Upgrades" onClick={() => setMultOpen(!isMultOpen)} />
      {isMultOpen && <MultUpgradePopUp onClose={() => setMultOpen(false)} />}
      <Button label="Open Available Projects" onClick={() => setProjectOpen(!isProjectOpen)} />
      {isProjectOpen && <ProjectSelectPopUp onClose={() => setProjectOpen(false)} />}
    </div>
  );
};

export default BottomLeft;
