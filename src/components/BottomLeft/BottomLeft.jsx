import React from "react";
import Button from "./Button/Button";
import styles from "./BottomLeft.module.css";

const BottomLeft = () => {
  return (
    <div className={styles.bottomLeft}>
      <Button label="Button 1" />
      <Button label="Button 2" />
      <Button label="Button 3" />
    </div>
  );
};

export default BottomLeft;
