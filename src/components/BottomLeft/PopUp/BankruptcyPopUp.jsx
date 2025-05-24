import React from "react";
import styles from "./BankruptcyPopUp.module.css";
import game from "../../../game/Game";
import Button from "../Button/Button";

const BankruptcyPopUp = ({ onClose, onTakeLoan }) => {
  const handleBankruptcy = () => {
    game.loanManager.declareBankruptcy();
    onClose();
  };
  return (
    <div className={styles.overlay}>
      <div className={`nes-container is-rounded ${styles.modal}`}>
        <h2>Financial Crisis!</h2>
        <p>Your balance is negative. You have two options:</p>

        <div>
          <Button label="Take a Loan" onClick={onTakeLoan} />
          <Button label="Declare Bankruptcy" onClick={handleBankruptcy} />
        </div>

        <p>Bankruptcy will reset all progress except prestige points.</p>
      </div>
    </div>
  );
};

export default BankruptcyPopUp;
