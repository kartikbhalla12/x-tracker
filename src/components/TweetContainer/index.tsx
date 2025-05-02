import { FC } from "react";

import TweetActions from "@/components/TweetContainer/TweetActions";
import Tweet from "@/components/TweetContainer/Tweet";
import styles from "@/components/TweetContainer/index.module.css";

import { IPaused, ITweet } from "@/interfaces/index.interface";

interface TweetContainerProps {
  tweet: ITweet;
  isPaused: IPaused;
  onLocalPauseChange: (isPaused: boolean) => void;
  onGlobalPauseChange: (isPaused: boolean) => void;
}

const TweetContainer: FC<TweetContainerProps> = ({
  tweet,
  isPaused,
  onLocalPauseChange,
  onGlobalPauseChange,
}) => (
  <div className={styles.tweetContainer}>
    <Tweet
      tweet={tweet}
      isPaused={isPaused}
      onLocalPauseChange={onLocalPauseChange}
    />
    <TweetActions onGlobalPauseChange={onGlobalPauseChange} tweet={tweet} />
  </div>
);

export default TweetContainer;
