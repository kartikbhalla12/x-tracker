import { useEffect, useState } from "react";
import { IPaused } from "../App";
import axios from "axios";
import AddTokenPopup from "./AddTokenPopup";
// import { analyzeTweet } from "../services/openai";

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
  entities?: {
    urls?: {
      expanded_url: string;
    }[];
  };
  quoted_tweet?: ITweet;
  isReply?: boolean;
  inReplyToId?: string;
}

const parseTweetText = (text: string) => text.split(" ").map((word) => {
  // console.log('word', word);
  if (word.trim().startsWith("http")) {
    const urlEnd = word.indexOf(" ", word.indexOf("http"));
    const url = urlEnd === -1 ? word : word.substring(0, urlEnd);
    return (
      <a key={url} href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    );
  }
  return `${word} `;
});




const Tweet = ({
  tweet,
  isPaused,
  setIsPaused,
  apiToken,
  openAIKey,
}: {
  tweet: ITweet;
  isPaused: IPaused;
  setIsPaused: (isPaused: IPaused) => void;
  apiToken: string;
  openAIKey: string;
}) => {
  const [timer, setTimer] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tweet.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = parseTweetText(tweet.text);

  const [urlPreview, setUrlPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!tweet?.entities?.urls?.length) return;
    const url = tweet?.entities?.urls[0]?.expanded_url;
    // console.log('url', url);

    const fetchUrlPreview = async () => {
      const urlPreview = await axios.get(
        `http://13.51.174.225:3001/metadata?url=${url}`
      );

      // console.log('urlPreview', urlPreview.data);
      setUrlPreview(urlPreview.data.ogImage);
    };
    fetchUrlPreview();
  }, [tweet?.entities]);

  const isReply = tweet.isReply

  const [reply, setReply] = useState<ITweet | null>(null);

  // console.log('urlPreview', urlPreview);





  // const tweetImage = getTweetImage();
  

  useEffect(() => {
    if (!isReply || !apiToken) return;

    const fetchReply = async () => {
      const reply = await axios.get(
          `/api/twitter/tweets?tweet_ids=${[tweet.inReplyToId]}`,
          { headers: { "X-API-Key": apiToken } }
        );
        setReply(reply.data?.tweets?.[0]);
      };
    fetchReply();
  }, [isReply, apiToken,tweet.inReplyToId]);

  const handleAddToken = (tokenData: {
    name: string;
    ticker: string;
    imageUrl: string;
    // tweetLink: string;
  }) => {
    // const { name, ticker, imageUrl } = tokenData;
    // Here you can handle the token data, e.g., send it to an API
    console.log('Adding token:', tokenData);
    // setIsPopupOpen(false);
    // analyzeTweet(tweet.text, imageUrl, openAIKey);
  };

  return (
   <div className="tweet-container">
 <div
      key={tweet.id}
      className="tweet"
      onMouseEnter={() =>
        !isPaused.global && setIsPaused({ ...isPaused, local: true })
      }
      onMouseLeave={() =>
        !isPaused.global && setIsPaused({ ...isPaused, local: false })
      }
      onClick={() => {
        window.open(tweet.url, "_blank");
      }}
    >
      <div className="tweet-header">
        <img
          src={tweet.author?.profilePicture}
          alt="Profile"
          className="profile-image"
        />
        <div className="tweet-author">
          <span className="author-name">{tweet.author?.name}</span>
          <span className="author-username">@{tweet.author?.userName}</span>
        </div>
        <div className="tweet-timer">{timer}s</div>
      </div>

      {isReply && reply && (
        <div 
          className="replied-to-tweet"
          onClick={(e) => {
            e.stopPropagation();
            window.open(reply.url, "_blank");
          }}
        >
          <div className="reply-chip">Replied to</div>
          <div className="replied-to-header">
            <img
              src={reply.author?.profilePicture}
              alt="Profile"
              className="replied-to-profile-image"
            />
            <div className="replied-to-author">
              <span className="replied-to-name">{reply.author?.name}</span>
              <span className="replied-to-username">@{reply.author?.userName}</span>
            </div>
          </div>
          <div className="replied-to-content">
            <p className="replied-to-text">{parseTweetText(reply.text)}</p>
            {reply.extendedEntities?.media?.map((media, index) => (
              <div key={media.media_url_https + index + "replied"} className="replied-to-media">
                <img
                  src={media.media_url_https}
                  alt="Media"
                  className="replied-to-media-image"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tweet-content">
        <p className="tweet-text">{tweetText}</p>

        {tweet.extendedEntities?.media?.map((media, index) => (
          <div key={index + media.media_url_https + "tweet"} className="tweet-media">
            <img
              src={media.media_url_https}
              alt="Media"
              className="media-image"
            />
          </div>
        ))}

        {urlPreview && (
          <div className="tweet-media">
            <img src={urlPreview} alt="Media" className="media-image" />
          </div>
        )}

        {tweet.quoted_tweet && (
          <div 
            className="quoted-tweet"
            onClick={(e) => {
              e.stopPropagation();
              window.open(tweet.quoted_tweet?.url, "_blank");
            }}
          >
            <div className="reply-chip">Quoted Tweet</div>
            <div className="quoted-tweet-header">
              <img
                src={tweet.quoted_tweet?.author?.profilePicture}
                alt="Profile"
                className="quoted-profile-image"
              />
              <div className="quoted-tweet-author">
                <span className="quoted-author-name">{tweet.quoted_tweet?.author?.name}</span>
                <span className="quoted-author-username">@{tweet.quoted_tweet?.author?.userName}</span>
              </div>
            </div>
            <div className="quoted-tweet-content">
              <p className="quoted-tweet-text">{parseTweetText(tweet.quoted_tweet?.text || "")}</p>
              {tweet.quoted_tweet?.extendedEntities?.media?.map((media, index) => (
                <div key={media.media_url_https + index + "quoted"} className="quoted-tweet-media">
                  <img
                    src={media.media_url_https}
                    alt="Media"
                    className="quoted-media-image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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

    <div className="tweet-actions"> 
      <button 
        className="launch-button"
        onClick={(e) => {
          e.stopPropagation();
          
          setIsPaused({ ...isPaused, global: true });
          setIsPopupOpen(true);
        }}
      >
        <svg
          className="launch-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 3h6v6"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M10 14L21 3"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        Launch
      </button>
    </div>

    <AddTokenPopup
      isOpen={isPopupOpen}
      onClose={() => {
        setIsPopupOpen(false)
        setIsPaused({ ...isPaused, global: false });
      }}
      onAddToken={handleAddToken}
      tweet={tweet}
      reply={reply}
      urlPreview={urlPreview}
      openAIKey={openAIKey}
    />
   </div>
  );
};

export default Tweet;
