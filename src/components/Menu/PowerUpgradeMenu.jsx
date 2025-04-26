import React from "react";
import game from '../../game/Game';
import Button from '../BottomLeft/Button/Button';
import { useState } from 'react';
import styles from './PowerUpgradeMenu.module.css';

const PowerUpgradeMenu = ({ onClose }) => {
  const initialUpgrades = [
    { id: 1, label: "Upgrade 1", price: 0.5, bought: game.upgrades.powerUpgrades[0] },
    { id: 2, label: "Upgrade 2", price: 1.0, bought: game.upgrades.powerUpgrades[1] },
    { id: 3, label: "Upgrade 3", price: 5.0, bought: game.upgrades.powerUpgrades[2] },
    { id: 4, label: "Upgrade 4", price: 20.0, bought: game.upgrades.powerUpgrades[3] },
  ];

  const [upgrades, setUpgrades] = useState(initialUpgrades);

  const handleAction = (id) => {
    const success = game.upgrades.powerUpgrade(id);
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
      {upgrades.map((upgrade) => (
        <Button
          key={upgrade.id}
          label={upgrade.bought
            ? `${upgrade.label}, Bought`
            : `${upgrade.label}, Price: ${upgrade.price}€`}
          onClick={() => handleAction(upgrade.id)}
        >
        </Button>
      ))}
    </div>
  );
}

export default PowerUpgradeMenu;