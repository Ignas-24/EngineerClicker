import React from "react";
import "./Achivements_button.css";

const Achievements_button = ({ onClick }) => {
  function handleClick() {
    onClick();
  }
  return (
    <button className="nes-btn is-success Achievements" onClick={handleClick}>
      ✓
    </button>
  );
};

export default Achievements_button;
