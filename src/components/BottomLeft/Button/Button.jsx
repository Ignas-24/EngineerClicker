import React from "react";

const Button = ({ label, onClick, title, disabled = false }) => {
  function handleClick() {
    if (!disabled) {
      onClick();
    }
  }

  return (
    <button
      className={`nes-btn ${disabled ? "is-disabled" : ""}`}
      onClick={handleClick}
      title={title}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
