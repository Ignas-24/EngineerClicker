import React, { useState, useSyncExternalStore } from "react";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import CloseButton from "./CloseButton";
import styles from "./MultUpgradeMenu.module.css";
import getCached from "../../util/getCached";

const getUpgrades = () => {
  return [
    {
      id: 1,
      label: "Upgrade 1",
      price: 1.0,
      bought: game.upgrades.multUpgrades[0],
    },
    {
      id: 2,
      label: "Upgrade 2",
      price: 1.0,
      bought: game.upgrades.multUpgrades[1],
    },
    {
      id: 3,
      label: "Upgrade 3",
      price: 1.0,
      bought: game.upgrades.multUpgrades[2],
    },
  ]
}

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
