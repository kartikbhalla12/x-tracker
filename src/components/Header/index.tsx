import { FC } from "react";

import styles from "@/components/Header/index.module.css";

interface HeaderProps {
  paused: boolean;
  onPauseToggle: () => void;
}

const Header: FC<HeaderProps> = ({ paused, onPauseToggle }) => {
  return (
    <div className={styles.appHeader}>
      <h1>X-Tracker</h1>
      <div
        className={`${styles.statusChip} ${
          paused ? styles.paused : styles.running
        }`}
        onClick={onPauseToggle}
      >
        {paused ? "Paused" : "Running"}
      </div>
    </div>
  );
};

export default Header;
