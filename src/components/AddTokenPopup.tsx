import React, { useEffect, useState } from 'react';
import './AddTokenPopup.css';
import { ITweet } from './Tweet';
import { analyzeTweet, TokenAnalysis } from '../services/openai';

interface AddTokenPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToken: (tokenData: {
    name: string;
    ticker: string;
    imageUrl: string;
    // tweetLink: string;
  }) => void;
  tweet: ITweet | null;
  reply: ITweet | null;
  urlPreview: string | null;
  openAIKey: string;
}

const getTweetImage = (tweet: ITweet | null, reply: ITweet | null, urlPreview: string | null): string | undefined => {
  if(!tweet) return '';
  // console.log('tweet', tweet);
  // Check for media in the main tweet
  if (tweet.extendedEntities?.media?.length) {
    return tweet.extendedEntities.media[0].media_url_https;
  }

  if(urlPreview) {
    return urlPreview;
  }

  // Check for media in quoted tweet
  if (tweet.quoted_tweet?.extendedEntities?.media?.length) {
    return tweet.quoted_tweet.extendedEntities.media[0].media_url_https;
  }

  // console.log('tweet.isReply', tweet.isReply, reply);

  // Check for media in replied to tweet
  if (tweet.isReply && reply?.extendedEntities?.media?.length) {
    // console.log('reply dsagjhdfgs ', reply.extendedEntities.media[0].media_url_https);
    return reply.extendedEntities.media[0].media_url_https;
  }

  // If no media found, return profile image
  return tweet.author.profilePicture;
};

const truncateText = (text: string, maxWords: number = 100) => {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

const AddTokenPopup: React.FC<AddTokenPopupProps> = ({ 
  isOpen, 
  onClose, 
  onAddToken, 
  tweet, 
  reply, 
  urlPreview,
  openAIKey 
}) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [analysis, setAnalysis] = useState<TokenAnalysis | null>(null);

  useEffect(() => {
    setImageUrl(getTweetImage(tweet, reply, urlPreview) || "");
  }, [tweet, reply, urlPreview]);

  useEffect(() => {
    if (isOpen && tweet && openAIKey) {
      setIsLoading(true);
      analyzeTweet(tweet.text, imageUrl, openAIKey)
        .then(result => {
          if (result) {
            // console.log('result', result);
            // setAnalysis(result);
            setName(result.tokenName);
            setTicker(result.ticker);
          }
        })
        .catch(error => {
          console.error('Error analyzing tweet:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, tweet, imageUrl, openAIKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToken({ name, ticker, imageUrl });
    setName('');
    setTicker('');
    setImageUrl('');
    onClose();
  };

  if (!isOpen || !tweet) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}
        <div className="popup-left">
          <div className="popup-header">
            <h2>Launch Token</h2>
            <button className="close-button" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="tweet-preview">
            <p>{truncateText(tweet.text)}</p>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Tweet media" 
                className="tweet-preview-image"
              />
            )}
          </div>
        </div>
        <div className="popup-right">
          <form onSubmit={handleSubmit} className="token-form">
            <div className="form-group">
              <label htmlFor="name">Token Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onFocus={() => setName("")}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter token name"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ticker">Ticker Symbol</label>
              <input
                type="text"
                id="ticker"
                value={ticker}
                onFocus={() => setTicker("")}
                onChange={(e) => setTicker(e.target.value)}
                required
                placeholder="Enter ticker symbol"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                placeholder="Enter image URL"
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tweetLink">Tweet Link</label>
              <input
                type="url"
                id="tweetLink"
                value={tweet?.url}
                required
                placeholder="Enter tweet URL"
                disabled
              />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={isLoading}>
                Launch Token
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTokenPopup; 