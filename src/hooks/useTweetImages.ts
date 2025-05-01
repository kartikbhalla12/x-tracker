import { useState, useEffect, useCallback } from "react";

import { getMetadata } from "@/services/metadata";

import { ITweet } from "@/interfaces/index.interface";

export const useTweetImages = (tweet: ITweet) => {
  const [images, setImages] = useState<string[]>([]);

  const getImages = useCallback(async () => {
    if (!tweet) return;
    if (tweet.attachedMedia?.length) setImages(tweet.attachedMedia);
    else if (tweet.attachedUrl) {
      const metadata = await getMetadata(tweet.attachedUrl);
      if (metadata) setImages([metadata.ogImage]);
    }
  }, [tweet]);

  useEffect(() => {
    getImages();
  }, [getImages]);

  return images;
};
