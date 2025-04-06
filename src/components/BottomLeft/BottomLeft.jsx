import React, { useState, useSyncExternalStore, useEffect } from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";
import game from "../../game/Game";
import PowerUpgradePopUp from "./PopUp/PowerUpgradePopUp";
import MultUpgradePopUp from "./PopUp/MultUpgradePopUp";
import LoanPopUp from "./PopUp/LoanPopUp";
import BankruptcyPopUp from "./PopUp/BankruptcyPopUp";

const BottomLeft = () => {
  const [isPowerOpen, setPowerOpen] = useState(false);
  const [isMultOpen, setMultOpen] = useState(false);
  const [isLoanOpen, setLoanOpen] = useState(false);
  const [isBankruptcyOpen, setBankruptcyOpen] = useState(false);

  const projectProgress = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.project.projectProgress
  );

  const euros = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.euro
  );

  const [projectState, setProjectState] = useState("");

  useEffect(() => {
    setProjectState(
      game.project.isActive() ? `Active project progress: ${projectProgress.toFixed(2)}` : "No active project"
    );
  }, [projectProgress, game.project.isActive()]);

  useEffect(() => {
    if (euros < 0) {
      setBankruptcyOpen(true);
    }
  }, [euros]);

  const handleProjectClick = () => {
    game.project.changeActiveState();
    setProjectState(game.project.isActive() ? `Active project progress: ${projectProgress.toFixed(2)}` : "No active project");
  }

  return (
    <div className={styles.bottomLeft}>
      <Button label="Bank" onClick={() => setLoanOpen(true)} />
      <Button label="Open Power Upgrades" onClick={() => setPowerOpen(true)} />
      {isPowerOpen && <PowerUpgradePopUp onClose={() => setPowerOpen(false)} />}
      <Button label="Open Multiplier Upgrades" onClick={() => setMultOpen(true)} />
      {isMultOpen && <MultUpgradePopUp onClose={() => setMultOpen(false)} />}
      <Button label={projectState} onClick={handleProjectClick} />

      {isLoanOpen && <LoanPopUp onClose={() => setLoanOpen(false)} />}
      {isBankruptcyOpen && (
        <BankruptcyPopUp
          onClose={() => setBankruptcyOpen(false)}
          onTakeLoan={() => {
            setBankruptcyOpen(false);
            setLoanOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default BottomLeft;
