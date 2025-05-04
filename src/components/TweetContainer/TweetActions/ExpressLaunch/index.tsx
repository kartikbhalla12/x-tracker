import { useState } from "react";

import { analyzeTweet } from "@/services/analyze";
import { launchToken } from "@/services/launchToken";

import { getImageUrlForLaunch, getImageUrlToAnalyze } from "@/utils/tweet";

import styles from "@/components/TweetContainer/TweetActions/ExpressLaunch/index.module.css";

import {
  ITweet,
  ILaunchSettings,
  ILaunchSuccess,
} from "@/interfaces/index.interface";

import Zap from "@/icons/Zap";

interface ExpressLaunchProps {
  tweet: ITweet;
  onGlobalPauseChange: (isPaused: boolean) => void;
  openAIKey: string;
  launchSettings: ILaunchSettings;

  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
  title: string;
  buyAmount?: number;
}

const ExpressLaunch = ({
  tweet,
  onGlobalPauseChange,
  openAIKey,
  launchSettings,
  onLaunchSuccess,
  title,
  buyAmount,
}: ExpressLaunchProps) => {
  const [isLaunchLoading, setIsLaunchLoading] = useState(false);

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setIsLaunchLoading(true);

    const imageUrl = await getImageUrlToAnalyze(tweet);

    const analysis = await analyzeTweet({
      text: tweet.text,
      imageUrl: imageUrl,
      openAIKey,
    });

    const launchImageUrl = await getImageUrlForLaunch(tweet);

    if (!analysis || !launchImageUrl) {
      setIsLaunchLoading(false);
    } else {
      const response = await launchToken({
        publicKey: launchSettings.walletPublicKey,
        privateKey: launchSettings.walletPrivateKey,
        tokenName: analysis.tokenName,
        tickerName: analysis.ticker,
        twitterUrl: tweet.url,
        tokenKey: launchSettings.tokenPrivateKey,
        buyAmount: buyAmount || Number(launchSettings.defaultBuyAmount) || 0,
        imageUrl: launchImageUrl,
      });

      if (response) {
        onLaunchSuccess({
          tokenName: analysis.tokenName,
          tickerName: analysis.ticker,
        });
      }
      setIsLaunchLoading(false);
    }
  };

  return (
    <div>
      <button className={styles.launchButton} onClick={handleLaunch}>
        {isLaunchLoading ? (
          "Launching..."
        ) : (
          <>
            <Zap className={styles.launchIcon} />
            {title}
          </>
        )}
      </button>
    </div>
  );
};

export default ExpressLaunch;
