import { FC } from "react";

import TweetActions from "@/components/TweetContainer/TweetActions";
import Tweet from "@/components/TweetContainer/Tweet";
import styles from "@/components/TweetContainer/index.module.css";

import { IPaused, ITweet, ILaunchSettings } from "@/interfaces/index.interface";

interface TweetContainerProps {
  tweet: ITweet;
  isPaused: IPaused;
  onLocalPauseChange: (isPaused: boolean) => void;
  onGlobalPauseChange: (isPaused: boolean) => void;
  openAIKey: string;
  launchSettings: ILaunchSettings;
}

const TweetContainer: FC<TweetContainerProps> = ({
  tweet,
  isPaused,
  onLocalPauseChange,
  onGlobalPauseChange,
  openAIKey,
  launchSettings,
}) => {


  // const handleLaunch = () => {
    

    
  //   console.log("launch"); //todo
  //   onGlobalPauseChange(true);  
  // };

  // const handleExpressLaunch = () => {
  //   console.log("express launch"); //todo
  //   onGlobalPauseChange(true);
  // };

  // const handleManualLaunch = () => {
  //   console.log("manual launch"); //todo
  //   onGlobalPauseChange(true);
  // };

  return (
    <div className={styles.tweetContainer}>
      <Tweet tweet={tweet} isPaused={isPaused} onLocalPauseChange={onLocalPauseChange} />
      <TweetActions
        // onLaunch={handleLaunch}
        // onExpressLaunch={handleExpressLaunch}
        // onManualLaunch={handleManualLaunch}
        onGlobalPauseChange={onGlobalPauseChange}
        tweet={tweet}
        openAIKey={openAIKey}
        launchSettings={launchSettings}
      />
    </div>
  );
};

export default TweetContainer;
