import React, { useEffect } from "react";

import styles from "@/components/TweetContainer/TweetActions/LaunchSuccess/index.module.css";

import { STORAGE_KEYS } from "@/constants/storage";
import { DEFAULT_LAUNCH_SETTINGS } from "@/constants/defaults";

import storage from "@/utils/storage";

import { ILaunchSettings } from "@/interfaces/index.interface";

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
  useEffect(() => {
    if (open) {
      const launchSettings =
        storage.get<ILaunchSettings>(STORAGE_KEYS.LAUNCH_SETTINGS) ||
        DEFAULT_LAUNCH_SETTINGS;

      storage.set(STORAGE_KEYS.LAUNCH_SETTINGS, {
        ...launchSettings,
        tokenPublicKey: "",
        tokenPrivateKey: "",
      });
    }
  }, [open]);

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
