import React from "react";
import TopLeft from "../TopLeft/TopLeft";
import BottomLeft from "../BottomLeft/BottomLeft";
import styles from "./LeftSection.module.css";

const LeftSection = () => {
  return (
    <div className={styles.leftSection}>
      <TopLeft />
      <BottomLeft />
    </div>
  );
};

export default LeftSection;
