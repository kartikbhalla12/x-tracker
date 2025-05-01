import { FC, useEffect, useState } from "react";

import styles from "@/components/TweetContainer/Tweet/TweetTimer/index.module.css";

const TweetTimer: FC = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);

    return () => clearInterval(interval);
  }, []);

  return <div className={styles.tweetTimer}>{timer}s</div>;
};

export default TweetTimer;
