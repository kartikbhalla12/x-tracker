import { FC } from "react";

import InnerTweet from "@/components/TweetContainer/Tweet/InnerTweet";
import ImageView from "@/components/TweetContainer/ImageView";
import TweetTimer from "@/components/TweetContainer/Tweet/TweetTimer";
import TweetFooter from "@/components/TweetContainer/Tweet/TweetFooter";
import styles from "@/components/TweetContainer/Tweet/index.module.css";

import useTweetImages from "@/hooks/useTweetImages";

import { parseTweetText } from "@/utils/tweet";

import { InnerTweetType, IPaused, ITweet } from "@/interfaces/index.interface";

interface ITweetProps {
  tweet: ITweet;
  isPaused: IPaused;
  onLocalPauseChange: (isPaused: boolean) => void;
  onGlobalPauseChange: (isPaused: boolean) => void;
}

const Tweet: FC<ITweetProps> = ({
  tweet,
  isPaused,
  onLocalPauseChange,
  onGlobalPauseChange,
}) => {
  const tweetText = parseTweetText(tweet.text);
  const images = useTweetImages(tweet);

  return (
    <div
      key={tweet.id}
      className={styles.tweet}
      onMouseEnter={() => !isPaused.global && onLocalPauseChange(true)}
      onMouseLeave={() => !isPaused.global && onLocalPauseChange(false)}
      onClick={() => {
        onGlobalPauseChange(true);
        window.open(tweet.url, "_blank");
      }}
    >
      <div className={styles.tweetHeader}>
        {tweet.author.profilePicture ? (
          <img
            src={tweet.author.profilePicture}
            alt="Profile"
            className={styles.profileImage}
          />
        ) : (
          <></>
        )}
        <div className={styles.tweetAuthor}>
          <span className={styles.authorName}>{tweet.author.name}</span>
          <span className={styles.authorUsername}>
            @{tweet.author.username}
          </span>
        </div>
        <TweetTimer />
      </div>

      {tweet.inReplyToTweet ? (
        <InnerTweet
          tweet={tweet.inReplyToTweet}
          type={InnerTweetType.replied}
          onGlobalPauseChange={onGlobalPauseChange}
        />
      ) : (
        <></>
      )}

      <div className={styles.tweetContent}>
        <p className={styles.tweetText}>{tweetText}</p>

        {images?.length ? (
          <div className={styles.tweetMedia}>
            <ImageView images={images} alt="Media" />
          </div>
        ) : (
          <></>
        )}

        {tweet.quotedTweet ? (
          <InnerTweet
            tweet={tweet.quotedTweet}
            type={InnerTweetType.quoted}
            onGlobalPauseChange={onGlobalPauseChange}
          />
        ) : (
          <></>
        )}
      </div>

      <TweetFooter tweetDate={tweet.createdAt} tweetUrl={tweet.url} />
    </div>
  );
};

export default Tweet;
