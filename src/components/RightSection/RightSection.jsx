import React from "react";
import ComputerCanvas from "../ComputerCanvas";
import styles from "./RightSection.module.css";

const RightSection = () => {
  return (
    <div className={styles.rightSection} style={{ padding: "8px" }}>
      <ComputerCanvas />
    </div>
  );
};

export default RightSection;
