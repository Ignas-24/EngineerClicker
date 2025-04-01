import React from "react";
import styles from "./Layout.module.css";
import LeftSection from "../LeftSection/LeftSection";
import RightSection from "../RightSection/RightSection";

const Layout = () => {
  return (
    <div className={styles.container}>
      <LeftSection />
      <RightSection />
    </div>
  );
};

export default Layout;
