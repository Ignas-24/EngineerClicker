import React, { useState } from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";
import { useMenu } from "../../contexts/MenuContext.jsx";
import BankruptcyPopUp from "./PopUp/BankruptcyPopUp";
import LoanPopUp from "./PopUp/LoanPopUp";
import game from "../../game/Game.js";
import { useSyncExternalStore } from "react";

const BottomLeft = () => {
  const { openMenu, toggleMenu } = useMenu();
  const [loanOpen, setLoanOpen] = useState(false);

  const inDebt = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.loanManager.inDebt
  );
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
      <Button label={companyLabel} onClick={() => toggleMenu("company")} />
      <Button label="Open Power Upgrades" onClick={() => toggleMenu("power")} />
      <Button label="Open Multiplier Upgrades" onClick={() => toggleMenu("mult")} />
      <Button label="Open Available Projects" onClick={() => toggleMenu("project")} />

      {loanOpen && (
        <LoanPopUp onClose={() => setLoanOpen(false)} />
      )}
      {!loanOpen && inDebt && (
        <BankruptcyPopUp
          onClose={() => setLoanOpen(false)}
          onTakeLoan={() => setLoanOpen(true)}
        />
      )}
    </div>
  );
};

export default BottomLeft;
