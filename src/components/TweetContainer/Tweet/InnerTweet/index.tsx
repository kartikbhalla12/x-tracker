import { FC } from "react";

import Chip from "@/components/TweetContainer/Tweet/Chip";
import styles from "@/components/TweetContainer/Tweet/InnerTweet/index.module.css";
import ImageView from "@/components/TweetContainer/ImageView";

import { parseTweetText } from "@/utils/tweet";

import { InnerTweetType, IInnerTweet } from "@/interfaces/index.interface";

interface InnerTweetProps {
  tweet: IInnerTweet;
  type: InnerTweetType;
  onGlobalPauseChange: (isPaused: boolean) => void;
}

const InnerTweet: FC<InnerTweetProps> = ({
  tweet,
  type,
  onGlobalPauseChange,
}) => {
  const { attachedMedia, author, text, url } = tweet;

  return (
    <div
      className={styles.innerTweet}
      onClick={(e) => {
        e.stopPropagation();
        onGlobalPauseChange(true);
        window.open(url, "_blank");
      }}
    >
      <Chip label={type} />
      <div className={styles.innerTweetHeader}>
        {author.profilePicture ? (
          <img
            src={author.profilePicture}
            alt="Profile"
            className={styles.quotedProfileImage}
          />
        ) : (
          <></>
        )}
        <div className={styles.innerTweetAuthor}>
          <span className={styles.quotedAuthorName}>{author.name}</span>
          <span className={styles.quotedAuthorUsername}>
            @{author.username}
          </span>
        </div>
      </div>
      <div className={styles.innerTweetContent}>
        <p className={styles.innerTweetText}>{parseTweetText(text || "")}</p>
        {attachedMedia ? (
          <div className={styles.innerTweetMedia}>
            <ImageView images={attachedMedia} alt="Media" />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default InnerTweet;
