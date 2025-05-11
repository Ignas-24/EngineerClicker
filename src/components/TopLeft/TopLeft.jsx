import React, { useSyncExternalStore } from "react";
import styles from "./TopLeft.module.css";
import game from "../../game/Game";

const TopLeft = () => {
  const activeProject = game.projectManager.selectedProjects.find(p => p.active);
  if (activeProject) {
    game.project = activeProject;
  }
  
  const euros = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.euro
  );

  const prestige = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.prestige
  );

  const multiplier = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.multiplier
  );

  const clickPower = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.clickPower
  );

  const hasLoan = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.loanManager.hasLoan
  );

  const remainingLoanAmount = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.loanManager.remainingLoanAmount
  );

  const projectName = useSyncExternalStore(
    game.subscribe.bind(game),
    () => {
      const project = game.project;
      return project && !project.completed && !project.failed ? project.projectName : "None selected"
    }
  );

  const projectProgress = useSyncExternalStore(
    game.subscribe.bind(game),
    () => {
      const project = game.project;
      return project && !project.completed && !project.failed ? project.projectProgress : 0;
    }
  );

  const projectSize = useSyncExternalStore(
    game.subscribe.bind(game),
    () => {
      const project = game.project 
      return project && !project.completed && !project.failed ? game.project.projectSize : 0
    }
  );

  const projectRemainingTime = useSyncExternalStore(
    game.subscribe.bind(game),
    () => {
      const project = game.project;
      return project && !project.completed && !project.failed ? project.remainingTime : 0;
    }
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
