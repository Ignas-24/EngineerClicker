import React from "react";
import styles from "./Button.module.css";

const Button = ({ label, onClick }) => {
  function handleClick() {
    onClick();
  }

  return (
    <button className={styles.customButton} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
