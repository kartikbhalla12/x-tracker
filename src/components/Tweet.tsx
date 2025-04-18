import { useEffect, useState } from "react";

export interface IMedia {
  media_url_https: string;
  type: string;
}

export interface IAuthor {
  userName: string;
  name: string;
  profilePicture: string;
}

export interface ITweet {
  id: string;
  text: string;
  createdAt: string;
  url: string;
  extendedEntities?: {
    media?: IMedia[];
  };
  author: IAuthor;
}

const Tweet = ({
  tweet,
  setIsPaused,
}: {
  tweet: ITweet;
  setIsPaused: (isPaused: boolean) => void;
}) => {
  const [timer, setTimer] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tweet.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = tweet.text.split(" ")[0];

  const finalText = tweetText.split("\n").map((word) => {
    if (word.startsWith("http")) {
      return (
        <div>
          <a key={word} href={word} target="_blank" rel="noopener noreferrer">
            {word}
          </a>{' '}
          </div>
      );
    }
    return `${word} `;
  });

  console.log(finalText);

  return (
    <div
      key={tweet.id}
      className="tweet"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => {
        window.open(tweet.url, "_blank");
      }}
    >
      <div className="tweet-header">
        <img
          src={tweet.author.profilePicture}
          alt="Profile"
          className="profile-image"
        />
        <div className="tweet-author">
          <span className="author-name">{tweet.author.name}</span>
          <span className="author-username">@{tweet.author.userName}</span>
        </div>
        <div className="tweet-timer">{timer}s</div>
      </div>

      <div className="tweet-content">
        <p className="tweet-text">
        {finalText}
        </p>

        {tweet.extendedEntities?.media?.map((media, index) => (
          <div key={index} className="tweet-media">
            <img
              src={media.media_url_https}
              alt="Media"
              className="media-image"
            />
          </div>
        ))}
      </div>

      <div className="tweet-footer">
        <span className="tweet-date">
          {new Date(tweet.createdAt).toLocaleString()}
        </span>
        <div className="tweet-actions">
          <button 
            className="copy-button"
            onClick={handleCopyUrl}
            title={copied ? "Copied!" : "Copy URL"}
          >
            <svg 
              className="copy-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" 
                fill="currentColor"
              />
            </svg>
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <a
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tweet-link"
            onClick={(e) => e.stopPropagation()}
          >
            View on Twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
