import { FC, useState, useEffect } from "react";
import styles from "./index.module.css";

import {
  ILaunchSettings,
  ILaunchSuccess,
  ITweet,
  IAnalysis,
} from "@/interfaces/index.interface";
import { launchToken } from "@/services/launchToken";
import Add from "@/icons/Add";

interface CustomAiExpressLaunchProps {
  customAnalysis: IAnalysis | null;
  launchSettings: ILaunchSettings;
  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
  tweet: ITweet;
  onGlobalPauseChange: (isPaused: boolean) => void;
  customAnalysisLoading: boolean;
  ipfsMetadataUri: string | null;
}

const CustomAiExpressLaunch: FC<CustomAiExpressLaunchProps> = ({
  tweet,
  onGlobalPauseChange,
  launchSettings,
  onLaunchSuccess,
  customAnalysis,
  customAnalysisLoading,
  ipfsMetadataUri,
}) => {
  const [isLaunchLoading, setIsLaunchLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    if (isScheduled && customAnalysis && ipfsMetadataUri) handleLaunch();
  }, [isScheduled, customAnalysis, ipfsMetadataUri]);

  if (!tweet) return null;

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setIsLaunchLoading(true);

    // const launchImageUrl = await getImageUrlForLaunch(tweet);

    if (!ipfsMetadataUri || !customAnalysis) {
      setIsLaunchLoading(false);
      setIsScheduled(false);
    } else {
      const response = await launchToken({
        publicKey: launchSettings.walletPublicKey,
        privateKey: launchSettings.walletPrivateKey,
        walletApiKey: launchSettings.walletApiKey,
        tokenName: customAnalysis.tokenName,
        tickerName: customAnalysis.ticker,
        // twitterUrl: tweet.url,
        tokenKey: launchSettings.tokenPrivateKey,
        buyAmount: Number(launchSettings.express1BuyAmount) || 0,
        // imageUrl: launchImageUrl,
        metadataUri: ipfsMetadataUri,
        launchType: launchSettings.launchType,
      });

      if (response) {
        onLaunchSuccess({
          tokenName: customAnalysis.tokenName,
          tickerName: customAnalysis.ticker,
        });
      }
      setIsLaunchLoading(false);
      setIsScheduled(false);
    }
  };

  const launchLoading = isLaunchLoading || isScheduled;

  const scheduleLaunch = () => setIsScheduled(true);

  return (
    <div className={styles.customAiExpress}>
      <div
        className={styles.tokenButton}
        // onClick={handleLaunch}
        // disabled={customAnalysisLoading || launchLoading}
      >
        {customAnalysisLoading ? (
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
      </div>

      <button
        className={styles.addButton}
        onClick={scheduleLaunch}
        disabled={launchLoading}
      >
        {launchLoading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : (
          <Add />
        )}
      </button>
    </div>
  );
};

export default CustomAiExpressLaunch;
