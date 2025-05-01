import { getMetadata } from "@/services/metadata";

import { ITweet } from "@/interfaces/index.interface";

export const parseTweetText = (text: string) =>
  text.split(" ").map((word, index) => {
    if (word.trim().startsWith("http")) {
      const urlEnd = word.indexOf(" ", word.indexOf("http"));
      const url = urlEnd === -1 ? word : word.substring(0, urlEnd);
      return (
        <span key={url + "-tweet-link-" + index}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>{" "}
        </span>
      );
    }
    return `${word} `;
  });

export const getImageUrlToAnalyze = async (tweet: ITweet) => {
  if (tweet.attachedMedia?.length) return tweet.attachedMedia[0];
  if (tweet.attachedUrl) {
    const metadata = await getMetadata(tweet.attachedUrl);
    if (metadata) return metadata.ogImage;
  }

  if (tweet.inReplyToTweet && tweet.inReplyToTweet.attachedMedia?.length)
    return tweet.inReplyToTweet.attachedMedia?.[0];
  if (tweet.quotedTweet && tweet.quotedTweet.attachedMedia?.length)
    return tweet.quotedTweet.attachedMedia?.[0];
  
  return null;
};


export const getImageUrlForLaunch = async (tweet: ITweet) => {
  const imageUrl = await getImageUrlToAnalyze(tweet);
  if (imageUrl) return imageUrl;

  const authorPicture = tweet.author.profilePicture;

  if(authorPicture) return authorPicture;

  return null;
};
