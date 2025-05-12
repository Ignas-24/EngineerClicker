import React, { useSyncExternalStore } from "react";
import getCached from "../../util/getCached";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import CloseButton from "./CloseButton";
import styles from "./PowerUpgradeMenu.module.css";

const getUpgrades = () => {
  return game.upgrades.powerUpgradeData.map((upgrade, index) => ({
    id: upgrade.id,
    label: `Upgrade ${upgrade.id}`,
    price: upgrade.price,
    bought: game.upgrades.powerUpgrades[index],
  }));
};

const PowerUpgradeMenu = ({ onClose }) => {
  const upgrades = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(getUpgrades),
  );

  const handleAction = (id) => {
    game.upgrades.powerUpgrade(id);
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
              : `${upgrade.label}, Price: ${upgrade.price}€`
          }
          onClick={() => handleAction(upgrade.id)}
        ></Button>
      ))}
    </div>
  );
};

export default PowerUpgradeMenu;
