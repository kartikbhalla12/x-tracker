import { useState } from "react";

import { launchToken } from "@/services/launchToken";

import LaunchTokenPopup from "@/components/TweetContainer/TweetActions/LaunchTokenPopup";
import styles from "@/components/TweetContainer/TweetActions/ManualLaunch/index.module.css";

import {
  ITweet,
  ILaunchSettings,
  ILaunchSuccess,
} from "@/interfaces/index.interface";

import User from "@/icons/User";

interface ManualLaunchProps {
  tweet: ITweet;
  onGlobalPauseChange: (isPaused: boolean) => void;
  launchSettings: ILaunchSettings;
  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
}

const ManualLaunch = ({
  tweet,
  onGlobalPauseChange,
  launchSettings,
  onLaunchSuccess,
}: ManualLaunchProps) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setPopupOpen(true);
  };

  return (
    <div>
      <button className={styles.launchButton} onClick={handleLaunch}>
        <User className={styles.launchIcon} />
        Manual Launch
      </button>

      <LaunchTokenPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onAddToken={async ({ imageUrl, name, ticker }) => {
          const response = await launchToken({
            publicKey: launchSettings.walletPublicKey,
            privateKey: launchSettings.walletPrivateKey,
            tokenName: name,
            tickerName: ticker,
            twitterUrl: tweet.url,
            tokenKey: launchSettings.tokenPrivateKey,
            buyAmount: Number(launchSettings.defaultBuyAmount) || 0,
            imageUrl: imageUrl,
          });

          if (response) {
            setPopupOpen(false);
            onLaunchSuccess({ tokenName: name, tickerName: ticker });
          }
        }}
        tweet={tweet}
      />
    </div>
  );
};

export default ManualLaunch;
