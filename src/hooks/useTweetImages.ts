import { useState, useEffect, useCallback } from "react";

import { getMetadata } from "@/services/metadata";

import { ITweet } from "@/interfaces/index.interface";

const useTweetImages = (tweet: ITweet) => {
  const [images, setImages] = useState<string[]>([]);

  const getImages = useCallback(async () => {
    if (!tweet) return;
    if (tweet.attachedMedia?.length) setImages(tweet.attachedMedia);
    else if (tweet.attachedUrl) {
      const metadata = await getMetadata(tweet.attachedUrl);

      const image = metadata?.ogImage || metadata?.twitterImage;
      if (image) setImages([image]);
    }
  }, [tweet]);

  useEffect(() => {
    getImages();
  }, [getImages]);

  return images;
};

export default useTweetImages;
