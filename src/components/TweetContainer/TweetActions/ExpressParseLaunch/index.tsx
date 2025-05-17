import { useState } from "react";

import { launchToken } from "@/services/launchToken";

import { getImageUrlForLaunch, getTweetText } from "@/utils/tweet";

import styles from "@/components/TweetContainer/TweetActions/ExpressParseLaunch/index.module.css";

import {
  ITweet,
  ILaunchSettings,
  ILaunchSuccess,
  IAnalysis,
} from "@/interfaces/index.interface";

import Zap from "@/icons/Zap";

interface ExpressParseLaunchProps {
  tweet: ITweet;
  onGlobalPauseChange: (isPaused: boolean) => void;
  launchSettings: ILaunchSettings;

  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
  title: string;
  buyAmount?: number;
}

const ExpressParseLaunch = ({
  tweet,
  onGlobalPauseChange,
  launchSettings,
  onLaunchSuccess,
  title,
  buyAmount,
}: ExpressParseLaunchProps) => {
  const [isLaunchLoading, setIsLaunchLoading] = useState(false);

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setIsLaunchLoading(true);

    let analysis: IAnalysis | null = null;
    const tweetText = await getTweetText(tweet.text);
    const tokenName = tweetText.substring(0, 35);

    if (tweetText.length <= 10) {
      analysis = {
        tokenName,
        ticker: tweetText.toUpperCase().split(" ").join(""),
      };
    } else {
      analysis = {
        tokenName,
        ticker: tweetText
          .split(" ")
          .reduce((acc, word) => acc + word.trim().charAt(0), "")
          .toUpperCase()
          .substring(0, 10),
      };
    }

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
            <span className={styles.launchText}>{title}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ExpressParseLaunch;
