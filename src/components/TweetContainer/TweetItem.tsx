import { FC, memo } from "react";

import TweetContainer from "@/components/TweetContainer";
import { IPaused, ITweet } from "@/interfaces/index.interface";

interface TweetItemProps {
  tweetId: string;
  getTweetById: (id: string) => ITweet | undefined;
  isPaused: IPaused;
  onLocalPauseChange: (isPaused: boolean) => void;
  onGlobalPauseChange: (isPaused: boolean) => void;
}

const TweetItem: FC<TweetItemProps> = ({
  tweetId,
  getTweetById,
  isPaused,
  onLocalPauseChange,
  onGlobalPauseChange,
}) => {
  const tweet = getTweetById(tweetId);

  if (!tweet) return null;

  return (
    <TweetContainer
      key={tweetId}
      tweet={tweet}
      isPaused={isPaused}
      onLocalPauseChange={onLocalPauseChange}
      onGlobalPauseChange={onGlobalPauseChange}
    />
  );
};

export default memo(TweetItem);
