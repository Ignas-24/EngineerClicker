import React, { useSyncExternalStore } from "react";
import styles from "./RightSection.module.css";
import ButtonCanvas from "../ButtonCanvas";
import game from "../../game/Game";
import Console from "../console/Console.jsx"
import { useState } from "react";

const RightSection = () => {

  const [text, addText] = useState([]);

  const euros = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.euro
  );

  const handleClick = () => {
    game.resourceManager.addEuros(1);

    addText( (prev) => [...prev, "test"]);
  };

  return (
    <div className={styles.rightSection} style={{ padding: "8px"}}>

      <Console textState={text} />
      <ButtonCanvas onClick={handleClick} />

      
    </div>
  );
};

export default RightSection;
