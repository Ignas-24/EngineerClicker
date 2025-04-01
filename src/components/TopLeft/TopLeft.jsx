import React, { useSyncExternalStore } from "react";
import styles from "./TopLeft.module.css";
import game from "../../game/Game";

const TopLeft = () => {
  const euros = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.euro
  );

  return (
    <div className={styles.topLeft}>
      <p>Euro: {euros}€</p>
      <p>Prestige: 0</p>
    </div>
  );
};

export default TopLeft;
