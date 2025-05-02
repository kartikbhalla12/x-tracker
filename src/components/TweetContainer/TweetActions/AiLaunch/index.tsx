import { useState } from "react";

import { analyzeTweet } from "@/services/analyze";
import { launchToken } from "@/services/launchToken";

import { getImageUrlToAnalyze } from "@/utils/tweet";

import LaunchTokenPopup from "@/components/TweetContainer/TweetActions/LaunchTokenPopup";
import styles from "@/components/TweetContainer/TweetActions/AILaunch/index.module.css";

import {
  IAnalysis,
  ITweet,
  ILaunchSettings,
  ILaunchSuccess,
} from "@/interfaces/index.interface";

import Link from "@/icons/Link";

interface AiLaunchProps {
  tweet: ITweet;
  onGlobalPauseChange: (isPaused: boolean) => void;
  openAIKey: string;
  launchSettings: ILaunchSettings;
  onLaunchSuccess: (launchSuccess: ILaunchSuccess) => void;
}

const AiLaunch = ({
  tweet,
  onGlobalPauseChange,
  openAIKey,
  launchSettings,
  onLaunchSuccess,
}: AiLaunchProps) => {
  const [isLaunchLoading, setIsLaunchLoading] = useState(false);
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleLaunch = async () => {
    onGlobalPauseChange(true);
    setIsLaunchLoading(true);
    const imageUrl = await getImageUrlToAnalyze(tweet);

    setPopupOpen(true);
    const analysis = await analyzeTweet({
      text: tweet.text,
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
        AI Launch
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
            tokenKey: launchSettings.tokenKey,
            buyAmount: Number(launchSettings.defaultBuyAmount) || 0,
            imageUrl: imageUrl,
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
      />
    </div>
  );
};

export default AiLaunch;
