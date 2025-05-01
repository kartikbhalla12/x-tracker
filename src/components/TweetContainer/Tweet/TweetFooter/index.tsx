import { FC, useCallback, useState } from "react";

import styles from "@/components/TweetContainer/Tweet/TweetFooter/index.module.css";

import Copy from "@/icons/Copy";
import { formatDate } from "@/utils/date";

interface TweetFooterProps {
  tweetUrl: string;
  tweetDate: string;
}

export const TweetFooter: FC<TweetFooterProps> = ({ tweetDate, tweetUrl }) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = formatDate(tweetDate);

  const handleCopyUrl = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tweetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tweetUrl]);

  return (
    <div className={styles.tweetFooter}>
      <span className={styles.tweetDate}>{formattedDate}</span>
      <div className={styles.tweetActions}>
        <button
          className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
          onClick={handleCopyUrl}
          title={copied ? "Copied!" : "Copy URL"}
        >
          <Copy className={styles.copyIcon} />
          {copied ? "Copied!" : "Copy URL"}
        </button>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.tweetLink}
          onClick={(e) => e.stopPropagation()}
        >
          View on Twitter
        </a>
      </div>
    </div>
  );
};
