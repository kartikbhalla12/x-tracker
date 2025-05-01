import { FC, useState } from "react";

import styles from "@/components/TweetContainer/TweetActions/index.module.css";

import Link from "@/icons/Link";
import Zap from "@/icons/Zap";
import User from "@/icons/User";
import LaunchTokenPopup from "./LaunchTokenPopup";
import { ITweet, IAnalysis, ILaunchSettings   } from "@/interfaces/index.interface";
// import { useTweetImages } from "@/hooks/useTweetImages";
import { getImageUrlForLaunch, getImageUrlToAnalyze } from "@/utils/tweet";
import { analyzeTweet } from "@/services/analyze";
import { launchToken } from "@/services/launchToken";


interface TweetActionsProps {
  // onLaunch: () => void;
  // onExpressLaunch: () => void;
  // onManualLaunch: () => void;
  onGlobalPauseChange: (isPaused: boolean) => void;
  tweet: ITweet;
  openAIKey: string;
  launchSettings: ILaunchSettings;
}

export const TweetActions: FC<TweetActionsProps> = ({
  // onLaunch,
  // onExpressLaunch,
  // onManualLaunch,
  tweet,
  onGlobalPauseChange,
  openAIKey,
  launchSettings,
}) => {

  const [isLaunchLoading, setIsLaunchLoading] = useState(false);
  const [analysis, setAnalysis] = useState<IAnalysis | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const [isExpressLaunchLoading, setIsExpressLaunchLoading] = useState(false);
 

  const handleLaunch = async() => {
    onGlobalPauseChange(true);
    setIsLaunchLoading(true);
    const imageUrl = await getImageUrlToAnalyze(tweet);

    const analysis = await analyzeTweet({
      text: tweet.text,
      imageUrl: imageUrl,
      openAIKey,
    })
    if(analysis) setAnalysis(analysis);

    setIsLaunchLoading(false);
    setPopupOpen(true);


    // console.log("launch", imageUrl, tweet.text);
  }

  const handleExpressLaunch =async () => {
    onGlobalPauseChange(true);
    setIsExpressLaunchLoading(true);

    const imageUrl = await getImageUrlToAnalyze(tweet);

    const analysis = await analyzeTweet({
      text: tweet.text,
      imageUrl: imageUrl,
      openAIKey,
    })
    
    const launchImageUrl = await getImageUrlForLaunch(tweet);

    if(!analysis || !launchImageUrl) {
      setIsExpressLaunchLoading(false);
      setPopupOpen(true);
    }
    else {
      launchToken({
        publicKey: launchSettings.walletPublicKey,
        privateKey: launchSettings.walletPrivateKey,
        tokenName: analysis.tokenName,
        tickerName: analysis.ticker,
        twitterUrl: tweet.url,
        tokenKey: launchSettings.tokenKey,
        buyAmount: Number(launchSettings.defaultBuyAmount) || 0,
        imageUrl: launchImageUrl,
      })
  
    }

   

    setIsLaunchLoading(false);


    //todo launch with analysis




  }

  const handleManualLaunch = () => {
    onGlobalPauseChange(true);
    setAnalysis(null);
    setPopupOpen(true);
    // console.log("manual launch");
  }
  

  return (
    <div className={styles.tweetActions}>
      <button className={styles.launchButton} onClick={handleLaunch}>
        {isLaunchLoading ? "Launching..." : <>
          <Link className={styles.launchIcon} />
          Launch
          </>}
      </button>
      <button
        className={`${styles.launchButton} ${styles.expressLaunchButton}`}
        onClick={handleExpressLaunch}
      >
          {isExpressLaunchLoading ? "Launching..." : <>
            <Zap className={styles.launchIcon} />
            Express AI Launch
            </>}
      </button>
      <button
        className={`${styles.launchButton} ${styles.manualLaunchButton}`}
        onClick={handleManualLaunch}
      >
        <User className={styles.launchIcon} />
        Manual Launch
      </button>

      <LaunchTokenPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onAddToken={async ({imageUrl,name,ticker}) => {
          await launchToken({
            publicKey: launchSettings.walletPublicKey,
            privateKey: launchSettings.walletPrivateKey,
            tokenName: name,
            tickerName: ticker,
            twitterUrl: tweet.url,
            tokenKey: launchSettings.tokenKey,
            buyAmount: Number(launchSettings.defaultBuyAmount) || 0,
            imageUrl: imageUrl,
          })

          setPopupOpen(false);
        }}
        tweet={tweet}
        analysis={analysis}
      />
    </div>
  );
};

export default TweetActions;
