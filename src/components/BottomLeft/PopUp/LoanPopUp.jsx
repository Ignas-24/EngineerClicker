import React, { useState, useSyncExternalStore } from "react";
import styles from "./LoanPopUp.module.css";
import game from "../../../game/Game";
import Button from "../Button/Button";
import getCached from "../../../util/getCached";

const LoanPopUp = ({ onClose }) => {
  const [loanAmount, setLoanAmount] = useState("");

  const { hasLoan, remainingLoanAmount, maxLoanAmount, interestRate } =
    useSyncExternalStore(
      game.subscribe.bind(game),
      getCached(() => ({
        hasLoan: game.loanManager.hasLoan,
        remainingLoanAmount: game.loanManager.remainingLoanAmount,
        maxLoanAmount: game.loanManager.getMaxLoanAmount(),
        interestRate: game.loanManager.getInterestRate(),
      })),
    );

  const handleTakeLoan = () => {
    const amount = parseFloat(loanAmount);
    if (amount > 0 && amount <= maxLoanAmount) {
      if (game.loanManager.takeLoan(amount)) {
        onClose();
      }
    }
  };
  return (
    <div className={styles.overlay}>
      <div className={`nes-container is-rounded ${styles.modal}`}>
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
            <p>Interest rate: {interestRate * 100}%</p>{" "}
            <div>
              <label>
                Loan Amount:
                <input
                  className="nes-input"
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
        <div style={{ marginTop: 8 }}>
          <Button label="Close" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default LoanPopUp;
