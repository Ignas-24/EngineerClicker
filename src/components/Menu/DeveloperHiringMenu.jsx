import React, { useSyncExternalStore } from "react";
import getCached from "../../util/getCached";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import styles from "./DeveloperHiringMenu.module.css";

const developerOptions = [
  {
    tier: "junior",
    label: "Hire Junior Developer (€300, €60 upkeep)",
    efficiency: "+0.1 progress/sec",
  },
  {
    tier: "midlevel",
    label: "Hire Mid-Level Developer (€600, €120 upkeep)",
    efficiency: "+0.3 progress/sec",
  },
  {
    tier: "senior",
    label: "Hire Senior Developer (€1,200, €300 upkeep)",
    efficiency: "+0.7 progress/sec",
  },
  {
    tier: "lead",
    label: "Hire Lead Developer (€3,000, €600 upkeep)",
    efficiency: "+1.5 progress/sec, boosts others by 10%",
  },
];

const getDevelopers = () => ({ ...game.companyManager.developers });

const DeveloperHiringMenu = ({ onClose }) => {
  const { developers, unlockedTiers } = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(() => ({
      developers: getDevelopers(),
      unlockedTiers: game.companyManager.currentCompany?.unlocks || [],
    })),
  );

  const availableDeveloperOptions = developerOptions.filter((developer) =>
    unlockedTiers.includes(developer.tier),
  );

  const handleHireDeveloper = (tier) => {
    game.companyManager.hireDeveloper(tier);
  };
  return (
    <div className={`nes-container is-rounded ${styles.buttonsContainer}`}>
      <h3>Hire Developers</h3>
      {availableDeveloperOptions.map((developer) => (
        <Button
          key={developer.tier}
          label={`${developer.label} (Hired: ${developers[developer.tier]})`}
          onClick={() => handleHireDeveloper(developer.tier)}
          title={`Efficiency: ${developer.efficiency}`}
        />
      ))}
    </div>
  );
};

export default DeveloperHiringMenu;
