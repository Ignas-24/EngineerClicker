import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import React, { useState, useSyncExternalStore } from "react";
import CompanyUpgradeMenu from "./CompanyUpgradeMenu";
import DeveloperHiringMenu from "./DeveloperHiringMenu";
import CloseButton from "./CloseButton";
import styles from "./CompanyMenu.module.css";

const CompanyMenu = ({ onClose }) => {
  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  const [isDeveloperOpen, setDeveloperOpen] = useState(false);

  const { currentCompany, completedProjectsThisReset } = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() => ({
      currentCompany: game.companyManager.currentCompany,
      completedProjectsThisReset: game.projectManager.completedProjectsThisReset
    }))
  );
  
  const handleBuyCompany = (type) => {
    game.companyManager.buyCompany(type);
  };

  return (
    <div className={styles.buttonsContainer}>
      <CloseButton onClick={onClose} />
      <h4>Completed Projects: {completedProjectsThisReset}</h4>
      {!currentCompany && (
        <Button
          label="Buy Small Software Development Studio (5,000 €)"
          onClick={() => handleBuyCompany("small")}
        />
      )}
      {currentCompany && (
        <>
          {currentCompany?.type === "small" && (
            <Button
              label="Upgrade to Medium Sized Software Company (20,000 €)"
              onClick={() => handleBuyCompany("medium")}
            />
          )}
          {currentCompany?.type === "medium" && (
            <Button
              label="Upgrade to Large Software Corporation (100,000 €)"
              onClick={() => handleBuyCompany("large")}
            />
          )}

          <Button
            label="Company upgrades"
            onClick={() => setUpgradeOpen(!isUpgradeOpen)}
          />
          <Button
            label="Hire developers"
            onClick={() => setDeveloperOpen(!isDeveloperOpen)}
          />

          {isUpgradeOpen && (
            <CompanyUpgradeMenu onClose={() => setUpgradeOpen(false)} />
          )}
          {isDeveloperOpen && (
            <DeveloperHiringMenu onClose={() => setDeveloperOpen(false)} />
          )}

          {(currentCompany.type === "medium" ||
            currentCompany.type === "large") &&
            completedProjectsThisReset >= 40 &&
            (completedProjectsThisReset - 40) % 10 === 0 && (
              <Button
                label="Sell Company"
                onClick={() => {
                  const confirmSell = confirm(
                    "Are you sure you want to sell your company?"
                  );
                  if (confirmSell) {
                    game.companyManager.sellCompany();
                  }
                }}
              />
            )}
        </>
      )}
      <br />
    </div>
  );
};

export default CompanyMenu;
