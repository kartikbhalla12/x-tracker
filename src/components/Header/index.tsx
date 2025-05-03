import { FC } from "react";

import styles from "@/components/Header/index.module.css";
import { ISocketStatus } from "@/interfaces/index.interface";

interface HeaderProps {
  paused: boolean;
  onPauseToggle: () => void;
  socketStatus: ISocketStatus;
}

const Header: FC<HeaderProps> = ({ paused, onPauseToggle, socketStatus }) => {
  const isConnected = socketStatus === ISocketStatus.CONNECTED;

  return (
    <div className={styles.appHeader}>
      <h1>X-Tracker</h1>

      <div
        className={`${styles.wsChip} ${
          isConnected ? styles.connected : styles.disconnected
        }`}
      >
        <span
          className={`${styles.dot} ${
            isConnected ? styles.connectedDot : styles.disconnectedDot
          }`}
        />
        Service: {isConnected ? "Connected" : "Disconnected"}
      </div>

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
