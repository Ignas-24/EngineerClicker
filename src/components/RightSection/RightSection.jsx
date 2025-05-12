import React from "react";
import ComputerCanvas from "../ComputerCanvas";
import styles from "./RightSection.module.css";
import { useMenu } from "../../contexts/MenuContext.jsx";
import CompanyMenu from "../Menu/CompanyMenu.jsx";
import PowerUpgradeMenu from "../Menu/PowerUpgradeMenu.jsx";
import MultUpgradeMenu from "../Menu/MultUpgradeMenu.jsx";
import ProjectSelectMenu from "../Menu/ProjectSelectMenu.jsx";

const RightSection = () => {
  const { openMenu, toggleMenu } = useMenu();

  return (
    <div
      className={styles.rightSection}
      style={{ padding: 8, position: "relative" }}
    >
      <div
        style={{
          display: openMenu === null ? "block" : "none",
          width: "100%",
          height: "100%",
        }}
      >
        <ComputerCanvas />
      </div>
      {openMenu === "company" && (
        <CompanyMenu onClose={() => toggleMenu(null)} />
      )}
      {openMenu === "power" && (
        <PowerUpgradeMenu onClose={() => toggleMenu(null)} />
      )}
      {openMenu === "mult" && (
        <MultUpgradeMenu onClose={() => toggleMenu(null)} />
      )}
      {openMenu === "project" && (
        <ProjectSelectMenu onClose={() => toggleMenu(null)} />
      )}
    </div>
  );
};

export default RightSection;
