import { FC } from "react";

import styles from "@/components/TweetContainer/Tweet/ImageView/index.module.css";

interface ImageViewProps {
  images: string[];
  alt?: string;
  className?: string;
}

const ImageView: FC<ImageViewProps> = ({ images, alt = "", className}) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={`${styles.imageContainer} ${className}`}>
        <img
          src={images[0]}
          alt={alt}
          className={styles.singleImage}
          loading="lazy"
        />
      </div>
    );
  }

  const displayImages = images.slice(0, 4);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      <div
        className={styles.multiImageContainer}
        data-count={displayImages.length}
      >
        {displayImages.map((image, index) => (
          <img
            key={image + "-display-" + index}
            src={image}
            alt={`${alt} ${index + 1}`}
            className={styles.multiImage}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageView;
