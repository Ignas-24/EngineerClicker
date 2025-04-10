import React, { useState, useSyncExternalStore, useEffect } from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";
import game from "../../game/Game.js";
import PowerUpgradePopUp from "./PopUp/PowerUpgradePopUp";
import MultUpgradePopUp from "./PopUp/MultUpgradePopUp";
import ProjectSelectPopUp from "./PopUp/ProjectSelectPopUp";
import LoanPopUp from "./PopUp/LoanPopUp";
import BankruptcyPopUp from "./PopUp/BankruptcyPopUp";
import CompanyPopUp from "./PopUp/CompanyPopUp";


const BottomLeft = () => {
  const [isPowerOpen, setPowerOpen] = useState(false);
  const [isMultOpen, setMultOpen] = useState(false);
  const [isProjectOpen, setProjectOpen] = useState(false);
  const [isLoanOpen, setLoanOpen] = useState(false);
  const [isCompanyOpen, setCompanyOpen] = useState(false);

  const inDebt = useSyncExternalStore(game.subscribe.bind(game), () => game.loanManager.inDebt);

  const currentCompany = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.companyManager.currentCompany
  );


  const companyLabel = currentCompany
    ? `${
        currentCompany.type === "small"
          ? "Small Software Development Studio"
          : currentCompany.type === "medium"
          ? "Medium Sized Software Company"
          : currentCompany.type === "large"
          ? "Large Software Corporation"
          : "Unknown"
      }`
    : "Buy a Company";

  return (
    <div className={styles.bottomLeft}>
      <Button label="Bank" onClick={() => setLoanOpen(true)} />
      <Button label={companyLabel} onClick={() => setCompanyOpen(!isCompanyOpen)} />
      {isCompanyOpen && <CompanyPopUp onClose={() => setCompanyOpen(false)} />}
      <Button label="Open Power Upgrades" onClick={() => setPowerOpen(!isPowerOpen)} />
      {isPowerOpen && <PowerUpgradePopUp onClose={() => setPowerOpen(false)} />}
      <Button label="Open Multiplier Upgrades" onClick={() => setMultOpen(!isMultOpen)} />
      {isMultOpen && <MultUpgradePopUp onClose={() => setMultOpen(false)} />}
      <Button label="Open Available Projects" onClick={() => setProjectOpen(!isProjectOpen)} />
      {isProjectOpen && <ProjectSelectPopUp onClose={() => setProjectOpen(false)} />}

      {isLoanOpen && <LoanPopUp onClose={() => setLoanOpen(false)} />}
      {(!isLoanOpen && inDebt) && (
        <BankruptcyPopUp
          onTakeLoan={() => {
            setLoanOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default BottomLeft;
