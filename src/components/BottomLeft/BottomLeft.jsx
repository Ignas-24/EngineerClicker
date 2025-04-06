import React, { useState, useSyncExternalStore, useEffect } from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";
import game from "../../game/Game";
import PowerUpgradePopUp from "./PopUp/PowerUpgradePopUp";
import MultUpgradePopUp from "./PopUp/MultUpgradePopUp";
import ProjectSelectPopUp from "./PopUp/ProjectSelectPopUp";
import LoanPopUp from "./PopUp/LoanPopUp";
import BankruptcyPopUp from "./PopUp/BankruptcyPopUp";

const BottomLeft = () => {
  const [isPowerOpen, setPowerOpen] = useState(false);
  const [isMultOpen, setMultOpen] = useState(false);
  const [isProjectOpen, setProjectOpen] = useState(false);
  const [isLoanOpen, setLoanOpen] = useState(false);
  const [isBankruptcyOpen, setBankruptcyOpen] = useState(false);

  return (
    <div className={styles.bottomLeft}>
      <Button label="Bank" onClick={() => setLoanOpen(true)} />
      <Button label="Open Power Upgrades" onClick={() => setPowerOpen(!isPowerOpen)} />
      {isPowerOpen && <PowerUpgradePopUp onClose={() => setPowerOpen(false)} />}
      <Button label="Open Multiplier Upgrades" onClick={() => setMultOpen(!isMultOpen)} />
      {isMultOpen && <MultUpgradePopUp onClose={() => setMultOpen(false)} />}
      <Button label="Open Available Projects" onClick={() => setProjectOpen(!isProjectOpen)} />
      {isProjectOpen && <ProjectSelectPopUp onClose={() => setProjectOpen(false)} />}

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
