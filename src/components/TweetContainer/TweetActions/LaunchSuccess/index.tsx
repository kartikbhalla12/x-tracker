import React from "react";

import styles from "@/components/TweetContainer/TweetActions/LaunchSuccess/index.module.css";

import SuccessIcon from "@/icons/Success";

interface LaunchSuccessProps {
  tokenName: string;
  tickerName: string;
  open: boolean;
  onClose: () => void;
}

const LaunchSuccess: React.FC<LaunchSuccessProps> = ({
  tokenName,
  tickerName,
  onClose,
  open,
}) => {
  if (!open) return null;

  return (
    <div className={styles.successPopup}>
      <div className={styles.successContent}>
        <div className={styles.successIcon}>
          <SuccessIcon />
        </div>
        <h2 className={styles.successTitle}>Token Launched Successfully!</h2>
        <div className={styles.tokenInfo}>
          <p className={styles.tokenName}>{`Token Name: ${tokenName}`}</p>
          <p className={styles.tickerName}>{`Ticker Name: ${tickerName}`}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LaunchSuccess;
