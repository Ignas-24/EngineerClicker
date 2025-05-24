import React from "react";
import "./Achivements_button.css";

const Achievements_button = ({ onClick }) => {
  function handleClick() {
    onClick();
  }
  return (
    <button className="nes-btn is-warning Achievements" onClick={handleClick}>
      <i class="nes-icon star"></i>
    </button>
  );
};

export default Achievements_button;
