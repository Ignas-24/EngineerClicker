import React from "react";
import "./Achivements.css";

const Achievements = ({ onClick }) => {
  function handleClick() {
    onClick();
  }

  return (
    <button className="Achievements" onClick={handleClick}>
      ✓
    </button>
  );
};

export default Achievements;
