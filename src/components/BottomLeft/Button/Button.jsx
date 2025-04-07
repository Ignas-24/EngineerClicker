import React from "react";
import styles from "./Button.module.css";

const Button = ({ label, onClick, title }) => {
  function handleClick() {
    onClick();
  }

  return (
    <button className={styles.customButton} onClick={handleClick} title={title}>
      {label}
    </button>
  );
};

export default Button;
