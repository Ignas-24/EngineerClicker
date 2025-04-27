import React, { useSyncExternalStore } from "react";
import getCached from "../../util/getCached";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import CloseButton from "./CloseButton";
import styles from "./PowerUpgradeMenu.module.css";

const getUpgrades = () => [
  {
    id: 1,
    label: "Upgrade 1",
    price: 0.5,
    bought: game.upgrades.powerUpgrades[0],
  },
  {
    id: 2,
    label: "Upgrade 2",
    price: 1.0,
    bought: game.upgrades.powerUpgrades[1],
  },
  {
    id: 3,
    label: "Upgrade 3",
    price: 5.0,
    bought: game.upgrades.powerUpgrades[2],
  },
  {
    id: 4,
    label: "Upgrade 4",
    price: 20.0,
    bought: game.upgrades.powerUpgrades[3],
  },
];

const PowerUpgradeMenu = ({ onClose }) => {
  const upgrades = useSyncExternalStore(
    game.subscribe.bind(game),
    getCached(getUpgrades)
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
