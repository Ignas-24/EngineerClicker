import React, { useSyncExternalStore } from "react";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import styles from "./CompanyUpgradeMenu.module.css";
import getCached from "../../util/getCached";

const upgradeOptions = {
  small: [
    {
      key: "reward",
      label: "Online marketing",
      effect: "10% project reward increase",
      cost: 600,
      upkeep: 60,
    },
    {
      key: "size",
      label: "Requirement refinement",
      effect: "5% reduced project size",
      cost: 1800,
      upkeep: 60,
    },
    {
      key: "speed",
      label: "Mentorship program",
      effect: "20% developer speed increase",
      cost: 1800,
      upkeep: 60,
    },
    {
      key: "biggerProjects",
      label: "Client referrals",
      effect: "Base project sizes increased 2x",
      cost: 3000,
      upkeep: 60,
    },
  ],
  medium: [
    {
      key: "reward2",
      label: "Client feedback loop",
      effect: "10% project reward increase",
      cost: 600,
      upkeep: 150,
    },
    {
      key: "size2",
      label: "Tech Stack Modernization",
      effect: "5% reduced project size",
      cost: 1800,
      upkeep: 150,
    },
    {
      key: "speed2",
      label: "Dev-ops pipeline",
      effect: "20% developer speed increase",
      cost: 6000,
      upkeep: 150,
    },
    {
      key: "biggerProjects2",
      label: "Government contracts",
      effect: "Base project sizes increased 2x",
      cost: 1200,
      upkeep: 150,
    },
  ],
  large: [
    {
      key: "reward3",
      label: "Time tracking software",
      effect: "10% project reward increase",
      cost: 600,
      upkeep: 600,
    },
    {
      key: "size3",
      label: "Scope creep protection",
      effect: "5% reduced project size",
      cost: 1800,
      upkeep: 600,
    },
    {
      key: "speed3",
      label: "Remote work policy",
      effect: "20% developer speed increase",
      cost: 30000,
      upkeep: 600,
    },
    {
      key: "biggerProjects3",
      label: "Global projects",
      effect: "Base project sizes increased 2x",
      cost: 45000,
      upkeep: 600,
    },
  ],
};

const getUpgrades = () => ({ ...game.upgrades.companyUpgrades });

const CompanyUpgradeMenu = ({ onClose }) => {
  const currentCompanyType = game.companyManager.currentCompany?.type;

  const validCompanyTypes = [];
  if (currentCompanyType === "large")
    validCompanyTypes.push("small", "medium", "large");
  else if (currentCompanyType === "medium")
    validCompanyTypes.push("small", "medium");
  else if (currentCompanyType === "small") validCompanyTypes.push("small");

  const availableUpgrades = validCompanyTypes.flatMap(
    (type) => upgradeOptions[type],
  );

  const upgrades = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(getUpgrades),
  );

  const handleUpgrade = (upgradeKey) => {
    game.upgrades.buyCompanyUpgrade(upgradeKey);
  };
  return (
    <div className={`nes-container is-rounded ${styles.buttonsContainer}`}>
      <h3>Company Upgrades</h3>
      {availableUpgrades.map((upgrade) => (
        <Button
          key={upgrade.key}
          label={
            upgrades[upgrade.key]
              ? `${upgrade.label} - Purchased`
              : `${upgrade.label} (${upgrade.cost} €)`
          }
          onClick={() => handleUpgrade(upgrade.key)}
          disabled={upgrades[upgrade.key]}
          title={`Effect: ${upgrade.effect}\nUpkeep Increase: ${upgrade.upkeep} €`}
        />
      ))}
    </div>
  );
};

export default CompanyUpgradeMenu;
