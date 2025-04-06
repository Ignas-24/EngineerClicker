import React from "react";
import ComputerCanvas from "../ComputerCanvas";
import styles from "./RightSection.module.css";

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
    <div className={styles.rightSection} style={{ padding: "8px" }}>
      <ComputerCanvas onClick={handleClick}/>
    </div>
  );
};

export default RightSection;
