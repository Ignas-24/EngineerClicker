import React, { useSyncExternalStore } from "react";
import styles from "./TopLeft.module.css";
import game from "../../game/Game";
import getCached from "../../util/getCached";

const TopLeft = () => {
  const { euros, prestige, multiplier, clickPower } = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() => ({
      euros: game.resourceManager.euro,
      prestige: game.resourceManager.prestige,
      multiplier: game.resourceManager.multiplier,
      clickPower: game.resourceManager.clickPower
    }))
  );

  const { hasLoan, remainingLoanAmount } = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() => ({
      hasLoan: game.loanManager.hasLoan,
      remainingLoanAmount: game.loanManager.remainingLoanAmount
    }))
  );

  const { projectName, projectProgress, projectSize, projectRemainingTime, activeProject } = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() => {
      // TODO: should be part of ProjectManager
      const activeProject = game.projectManager.selectedProjects.find(p => p.active);
      if (activeProject) {
        game.project = activeProject;
      }
      
      const project = game.project;
      const isActiveProject = project && !project.completed && !project.failed;
      
      return {
        activeProject,
        projectName: isActiveProject ? project.projectName : "None selected",
        projectProgress: isActiveProject ? project.projectProgress : 0,
        projectSize: isActiveProject ? project.projectSize : 0,
        projectRemainingTime: isActiveProject ? project.remainingTime : 0
      };
    })
  );

  return (
    <div className={styles.topLeft}>
      <p>Euro: {parseFloat(euros).toFixed(2)}€</p>
      <p>Prestige: {prestige}</p>
      <p>Current typing power: {parseFloat(clickPower).toFixed(2)}, Multiplier: {multiplier}</p>
      <p>Active project: {projectName || "None selected"}</p>
      <p>Progress: {parseFloat(projectProgress || 0).toFixed(2)}, Size: {projectSize || 0}, Time left: {projectRemainingTime || 0}</p>
      {hasLoan && <p>Loan: {parseFloat(remainingLoanAmount).toFixed(2)}€</p>}
    </div>
  );
};

export default TopLeft;
