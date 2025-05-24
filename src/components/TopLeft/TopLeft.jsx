import React, { useSyncExternalStore } from "react";
import styles from "./TopLeft.module.css";
import game from "../../game/Game";
import getCached from "../../util/getCached";

const TopLeft = () => {
  const { upkeep, euros, prestige, multiplier, clickPower } =
    useSyncExternalStore(
      game.subscribe.bind(game),
      getCached(() => ({
        upkeep: game.companyManager.calculateDeveloperUpkeep(),
        euros: game.resourceManager.euro,
        prestige: game.resourceManager.prestige,
        multiplier: game.resourceManager.multiplier,
        clickPower: game.resourceManager.clickPower,
      })),
    );

  const { hasLoan, remainingLoanAmount } = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() => ({
      hasLoan: game.loanManager.hasLoan,
      remainingLoanAmount: game.loanManager.remainingLoanAmount,
    })),
  );

  const { projectName, projectProgress, projectSize, projectRemainingTime } =
    useSyncExternalStore(
      game.subscribe.bind(game),
      getCached(() => {
        const project = game.project;
        const isActiveProject =
          project && !project.completed && !project.failed;
        return {
          projectName: isActiveProject ? project.projectName : "None selected",
          projectProgress: isActiveProject ? project.projectProgress : 0,
          projectSize: isActiveProject ? project.projectSize : 0,
          projectRemainingTime: isActiveProject ? project.remainingTime : 0,
        };
      }),
    );
  return (
    <div className={`nes-container ${styles.topLeft}`}>
      <div className="nes-container with-title">
        <p className="title">Resources</p>
        <p>Euro: {parseFloat(euros).toFixed(2)}€</p>
        <p>Prestige: {prestige}</p>
        {hasLoan && <p>Loan: {parseFloat(remainingLoanAmount).toFixed(2)}€</p>}
      </div>

      <div className="nes-container with-title">
        <p className="title">Performance</p>
        <p>Current typing power: {parseFloat(clickPower).toFixed(2)}</p>
        <p>Multiplier: {multiplier}</p>
        <p>Developer upkeep: {parseFloat(upkeep).toFixed(2)}€ / 5 min</p>
      </div>

      <div className="nes-container with-title">
        <p className="title">Active Project</p>
        <p>Project: {projectName || "None selected"}</p>
        <p>Progress: {parseFloat(projectProgress || 0).toFixed(2)}</p>
        <p>Size: {projectSize || 0}</p>
        <p>Time left: {projectRemainingTime || 0}</p>
      </div>
    </div>
  );
};

export default TopLeft;
