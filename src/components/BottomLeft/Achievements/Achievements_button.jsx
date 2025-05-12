import React from "react";
import "./Achivements_button.css";

const Achievements_button = ({ onClick }) => {
  function handleClick() {
    onClick();
  }

  return (
    <button className="Achievements" onClick={handleClick}>
      ✓
    </button>
  );
};

export default Achievements_button;
