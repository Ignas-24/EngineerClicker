import React from "react";
import ComputerCanvas from "../ButtonCanvas";
import styles from "./RightSection.module.css";

const RightSection = () => {
  return (
    <div className={styles.rightSection} style={{ padding: "8px" }}>
      <ComputerCanvas />
    </div>
  );
};

export default RightSection;
