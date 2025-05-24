import { useState } from "react";

import { analyzeTweet } from "@/services/analyze";
import { launchToken } from "@/services/launchToken";

import { getImageUrlToAnalyze, trimTweetText } from "@/utils/tweet";

import LaunchTokenPopup from "@/components/TweetContainer/TweetActions/LaunchTokenPopup";
import styles from "@/components/TweetContainer/TweetActions/AiLaunch/index.module.css";

import {
  IAnalysis,
  ITweet,
  ILaunchSettings,
  ILaunchSuccess,
} from "@/interfaces/index.interface";

import Link from "@/icons/Link";

interface AiLaunchProps {
  title: string;
  tweet: ITweet | null;
  onGlobalPauseChange: (isPaused: boolean) => void;
  openAIKey: string;
  launchSettings: ILaunchSettings;
  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
  ipfsMetadataUri: string | null;
}

const AiLaunch = ({
  tweet,
  onGlobalPauseChange,
  openAIKey,
  launchSettings,
  onLaunchSuccess,
  title,
  ipfsMetadataUri,
}: AiLaunchProps) => {
  const [isLaunchLoading, setIsLaunchLoading] = useState(false);
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  if (!tweet) return null;

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setIsLaunchLoading(true);
    const imageUrl = await getImageUrlToAnalyze(tweet);

    setPopupOpen(true);
    const analysis = await analyzeTweet({
      text: trimTweetText(tweet.text),
      imageUrl: imageUrl,
      openAIKey,
    });
    if (analysis) setAnalysis(analysis);

    setIsLaunchLoading(false);
  };

  return (
    <div>
      <button className={styles.launchButton} onClick={handleLaunch}>
        <Link className={styles.launchIcon} />
        <span className={styles.launchText}>{title}</span>
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
            setAnalysis(null);
            setPopupOpen(false);
            onLaunchSuccess({ tokenName: name, tickerName: ticker });
          }
        }}
        tweet={tweet}
        analysis={analysis}
        loading={isLaunchLoading}
        defaultBuyAmount={launchSettings.defaultBuyAmount}
      />
    </div>
  );
};

export default AiLaunch;
