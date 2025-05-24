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
  tweet: ITweet | null;
  onGlobalPauseChange: (isPaused: boolean) => void;
  launchSettings: ILaunchSettings;
  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
  ipfsMetadataUri: string | null;
}

const ManualLaunch = ({
  tweet,
  onGlobalPauseChange,
  launchSettings,
  onLaunchSuccess,
  ipfsMetadataUri,
}: ManualLaunchProps) => {
  const [popupOpen, setPopupOpen] = useState(false);

  if (!tweet) return null;

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setPopupOpen(true);
  };

  return (
    <div>
      <button className={styles.launchButton} onClick={handleLaunch}>
        <User className={styles.launchIcon} />
        <span className={styles.launchText}>Manual</span>
      </button>

      <LaunchTokenPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onAddToken={async ({ name, ticker, buyAmount }) => {
          //TODO use imageUrl from form

          if (!ipfsMetadataUri) return;

          const response = await launchToken({
            publicKey: launchSettings.walletPublicKey,
            privateKey: launchSettings.walletPrivateKey,
            walletApiKey: launchSettings.walletApiKey,
            tokenName: name,
            tickerName: ticker,
            // twitterUrl: tweet.url,
            tokenKey: launchSettings.tokenPrivateKey,
            buyAmount:
              Number(buyAmount) || Number(launchSettings.defaultBuyAmount) || 0,
            metadataUri: ipfsMetadataUri,
            launchType: launchSettings.launchType,
          });

          if (response) {
            setPopupOpen(false);
            onLaunchSuccess({ tokenName: name, tickerName: ticker });
          }
        }}
        tweet={tweet}
        defaultBuyAmount={launchSettings.defaultBuyAmount}
      />
    </div>
  );
};

export default ManualLaunch;
