import React, { useSyncExternalStore } from "react";
import styles from "./TopLeft.module.css";
import game from "../../game/Game";

const TopLeft = () => {
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

  return (
    <div className={styles.topLeft}>
      <p>Euro: {euros}€</p>
      <p>Prestige: {prestige}</p>
      <p>Current typing power: {clickPower}, Multiplier: {multiplier}</p>
    </div>
  );
};

export default TopLeft;
