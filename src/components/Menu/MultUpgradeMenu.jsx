import React, { useSyncExternalStore } from "react";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import CloseButton from "./CloseButton";
import styles from "./MultUpgradeMenu.module.css";
import getCached from "../../util/getCached";

const getUpgrades = () => {
  return game.upgrades.multiplierUpgradeData.map((upgrade, index) => {
    const requirementMet = upgrade.requires === null || 
                          game.upgrades.multUpgrades[upgrade.requires - 1];
    
    return {
      id: upgrade.id,
      label: `Upgrade ${upgrade.id}`,
      price: upgrade.price,
      bought: game.upgrades.multUpgrades[index],
      available: !game.upgrades.multUpgrades[index] && 
                requirementMet && 
                game.resourceManager.prestige >= upgrade.price
    };
  });
};

const MultUpgradeMenu = ({ onClose }) => {
  const upgrades = useSyncExternalStore(game.subscribe.bind(game), getCached(getUpgrades));

  const handleAction = (id) => {
    game.upgrades.multUpgrade(id);
  };

  return (
    <div className={styles.buttonsContainer}>
      <CloseButton onClick={onClose} />
      {upgrades.map((upgrade) => (
        <Button
          key={upgrade.id}
          label={
            upgrade.bought
              ? `${upgrade.label}, Bought`
              : `${upgrade.label}, Price: ${upgrade.price} Prestige`
          }
          onClick={() => handleAction(upgrade.id)}
        ></Button>
      ))}
    </div>
  );
};

export default MultUpgradeMenu;
