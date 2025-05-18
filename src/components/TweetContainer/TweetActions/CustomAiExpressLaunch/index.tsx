import { FC, useState } from "react";
import styles from "./index.module.css";

import {
  ILaunchSettings,
  ILaunchSuccess,
  ITweet,
  IAnalysis,
} from "@/interfaces/index.interface";
import { launchToken } from "@/services/launchToken";
import { getImageUrlForLaunch } from "@/utils/tweet";

interface CustomAiExpressLaunchProps {
  customAnalysis: IAnalysis | null;
  launchSettings: ILaunchSettings;
  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
  tweet: ITweet;
  onGlobalPauseChange: (isPaused: boolean) => void;
  customAnalysisLoading: boolean;
}

const CustomAiExpressLaunch: FC<CustomAiExpressLaunchProps> = ({
  tweet,
  onGlobalPauseChange,
  launchSettings,
  onLaunchSuccess,
  customAnalysis,
  customAnalysisLoading,
}) => {
  const [isLaunchLoading, setIsLaunchLoading] = useState(false);

  if (!tweet) return null;

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setIsLaunchLoading(true);

    const launchImageUrl = await getImageUrlForLaunch(tweet);

    if (!launchImageUrl) {
      setIsLaunchLoading(false);
    } else {
      const response = await launchToken({
        // publicKey: launchSettings.walletPublicKey,
        // privateKey: launchSettings.walletPrivateKey,
        walletApiKey: launchSettings.walletApiKey,
        tokenName: customAnalysis?.tokenName || "",
        tickerName: customAnalysis?.ticker || "",
        twitterUrl: tweet.url,
        tokenKey: launchSettings.tokenPrivateKey,
        buyAmount: Number(launchSettings.express1BuyAmount) || 0,
        imageUrl: launchImageUrl,
      });

      if (response) {
        onLaunchSuccess({
          tokenName: customAnalysis?.tokenName || "",
          tickerName: customAnalysis?.ticker || "",
        });
      }
      setIsLaunchLoading(false);
    }
  };

  const loading = customAnalysisLoading || isLaunchLoading;

  return (
    <button
      className={styles.tokenButton}
      onClick={handleLaunch}
      disabled={loading}
    >
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : (
        <div className={styles.tokenInfo}>
          <span className={styles.tokenName}>
            {customAnalysis?.tokenName || "NO DATA"}
          </span>
          <span className={styles.tickerName}>
            {customAnalysis?.ticker || "NO DATA"}
          </span>
        </div>
      )}
    </button>
  );
};

export default CustomAiExpressLaunch;
