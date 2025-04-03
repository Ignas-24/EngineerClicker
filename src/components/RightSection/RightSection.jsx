import React, { useSyncExternalStore } from "react";
import styles from "./RightSection.module.css";
import ButtonCanvas from "../ButtonCanvas";
import game from "../../game/Game";
import Console from "../console/Console"
import { useState } from "react";

const RightSection = () => {

  const [text, addText] = useState([]);

  const euros = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.resourceManager.euro
  );
  
  const projectProgress = useSyncExternalStore(
    game.subscribe.bind(game),
    () => game.project.projectProgress
  );

  const handleClick = () => {
    if(game.project.isActive()) {
      game.project.addProgress();
    }
    else if(!game.project.isActive()) {
      game.resourceManager.addEuros();
    }

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
