import React from "react";
import ComputerCanvas from "../ComputerCanvas";
import styles from "./RightSection.module.css";
import { useMenu } from "../../contexts/MenuContext.jsx";
import CompanyMenu from "../Menu/CompanyMenu.jsx";
import PowerMenu from "../Menu/PowerUpgradeMenu.jsx";
import MultMenu from "../Menu/MultUpgradeMenu.jsx";
import ProjectMenu from "../Menu/ProjectSelectMenu.jsx";

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
      {openMenu === "power" && <PowerMenu onClose={() => toggleMenu(null)} />}
      {openMenu === "mult" && <MultMenu onClose={() => toggleMenu(null)} />}
      {openMenu === "project" && (
        <ProjectMenu onClose={() => toggleMenu(null)} />
      )}
    </div>
  );
};

export default RightSection;
