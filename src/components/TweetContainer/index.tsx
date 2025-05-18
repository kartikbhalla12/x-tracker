import { FC, useEffect, useState } from "react";

import TweetActions from "@/components/TweetContainer/TweetActions";
import Tweet from "@/components/TweetContainer/Tweet";
import styles from "@/components/TweetContainer/index.module.css";

import {
  IAnalysis,
  IApiSettings,
  IPaused,
  ITweet,
} from "@/interfaces/index.interface";
import { customAnalyzeTweet } from "@/services/customAnalyze";
import { getImageUrlToAnalyze, trimTweetText } from "@/utils/tweet";
import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/storage";

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
}) => {
  const [customAnalysis, setCustomAnalysis] = useState<IAnalysis | null>(null);
  const [customAnalysisLoading, setCustomAnalysisLoading] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setCustomAnalysisLoading(true);
      const image = await getImageUrlToAnalyze(tweet);
      if (!tweet) return setCustomAnalysisLoading(false);

      const configSettings = storage.get<IApiSettings>(
        STORAGE_KEYS.API_SETTINGS
      );

      if (!configSettings?.openAIKey) return;

      const analysis = await customAnalyzeTweet({
        text: trimTweetText(tweet.text),
        imageUrl: image || null,
        openAIKey: configSettings.openAIKey,
      });

      setCustomAnalysis(analysis);
      setCustomAnalysisLoading(false);
    })();
  }, [tweet]);

  return (
    <div className={styles.tweetContainer}>
      <Tweet
        tweet={tweet}
        isPaused={isPaused}
        onLocalPauseChange={onLocalPauseChange}
        onGlobalPauseChange={onGlobalPauseChange}
      />
      <TweetActions
        onGlobalPauseChange={onGlobalPauseChange}
        tweet={tweet}
        isPaused={isPaused}
        onLocalPauseChange={onLocalPauseChange}
        customAnalysis={customAnalysis}
        customAnalysisLoading={customAnalysisLoading}
      />
    </div>
  );
};

export default TweetContainer;
