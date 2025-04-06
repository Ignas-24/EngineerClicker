import React, { useState, useSyncExternalStore } from "react";
import styles from "./LoanPopUp.module.css";
import game from "../../../game/Game";
import Button from "../Button/Button";

const LoanPopUp = ({ onClose }) => {
  const [loanAmount, setLoanAmount] = useState("");

  const hasLoan = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.loanManager.hasLoan
  );

  const remainingLoanAmount = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.loanManager.remainingLoanAmount
  );

  const maxLoanAmount = game.loanManager.getMaxLoanAmount();
  const interestRate = game.loanManager.getInterestRate();

  const handleTakeLoan = () => {
    const amount = parseFloat(loanAmount);
    if (amount > 0 && amount <= maxLoanAmount) {
      game.loanManager.takeLoan(amount);
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Bank</h2>

        {hasLoan ? (
          <div>
            <p>Current Loan: {parseFloat(remainingLoanAmount).toFixed(2)}€</p>
            <p>5% of the loan is paid every 5 minutes</p>
            <Button
              label="Pay Off Loan"
              onClick={() => {
                game.loanManager.payOffLoan();
                onClose();
              }}
            />
          </div>
        ) : (
          <div>
            <p>Maximum loan amount: {maxLoanAmount}€</p>
            <p>Interest rate: {interestRate * 100}%</p>
            <div>
              <label>
                Loan Amount:
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  min="1"
                  max={maxLoanAmount}
                />
              </label>
            </div>
            <Button label="Take Loan" onClick={handleTakeLoan} />
          </div>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LoanPopUp;
