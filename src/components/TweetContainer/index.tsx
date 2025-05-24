import { FC, memo, useEffect, useState } from "react";

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
import {
  getImageUrlForLaunch,
  getImageUrlToAnalyze,
  trimTweetText,
} from "@/utils/tweet";
import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/storage";
import { getIpfsMetadataUri } from "@/services/getIpfs";
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

  const [ipfsMetadataUri, setIpfsMetadataUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setCustomAnalysisLoading(true);
      const image = await getImageUrlToAnalyze(tweet);
      if (!tweet) return setCustomAnalysisLoading(false);

      const configSettings = storage.get<IApiSettings>(
        STORAGE_KEYS.API_SETTINGS
      );

      if (!configSettings?.openAIKey) return;

      const tweetText = `
      Tweet: ${trimTweetText(tweet.text)}
      Quoted Tweet: ${
        tweet.quotedTweet?.text ? trimTweetText(tweet.quotedTweet.text) : "None"
      }
      Replied To Tweet: ${
        tweet.inReplyToTweet?.text
          ? trimTweetText(tweet.inReplyToTweet.text)
          : "None"
      }
      `;

      const analysis = await customAnalyzeTweet({
        text: tweetText,
        imageUrl: image || null,
        openAIKey: configSettings.openAIKey,
        openAIModel: configSettings.openAIModel,
      });

      setCustomAnalysis(analysis);
      setCustomAnalysisLoading(false);

      const launchImageUrl = await getImageUrlForLaunch(tweet);
      if (!launchImageUrl || !analysis) return;

      const metadataUri = await getIpfsMetadataUri({
        imageUrl: launchImageUrl,
        tickerName: analysis.ticker,
        tokenName: analysis.tokenName,
        twitterUrl: tweet.url,
      });

      if (!metadataUri) return;

      setIpfsMetadataUri(metadataUri);
    })();
  }, []);

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
        ipfsMetadataUri={ipfsMetadataUri}
      />
    </div>
  );
};

export default memo(TweetContainer);
