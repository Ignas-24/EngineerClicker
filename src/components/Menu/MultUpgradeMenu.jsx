import React, { useState } from "react";
import game from "../../game/Game";
import Button from "../BottomLeft/Button/Button";
import CloseButton from "./CloseButton";
import styles from "./MultUpgradeMenu.module.css";

const MultUpgradeMenu = ({ onClose }) => {
  const initialUpgrades = [
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
  ];

  const [upgrades, setUpgrades] = useState(initialUpgrades);

  const handleAction = (id) => {
    const success = game.upgrades.multUpgrade(id);
    if (success) {
      setUpgrades((prevUpgrades) =>
        prevUpgrades.map((upgrade) =>
          upgrade.id === id ? { ...upgrade, bought: true } : upgrade
        )
      );
    }
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
