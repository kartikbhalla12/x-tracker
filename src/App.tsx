import { useEffect, useState } from "react";

import Settings from "@/components/Settings";
import TweetItem from "@/components/TweetContainer/TweetItem";
import Header from "@/components/Header";

import useWebSockets from "@/hooks/useWebSockets";

import styles from "@/app.module.css";

import { IPaused } from "@/interfaces/index.interface";

function App() {
  const [isPaused, setIsPaused] = useState<IPaused>({
    global: false,
    local: false,
  });

  const { tweetIds, getTweetById, pause, resume, socketStatus } =
    useWebSockets();

  const paused = isPaused.global || isPaused.local;

  useEffect(() => {
    if (paused) pause();
    else resume();
  }, [paused, pause, resume]);

  return (
    <div className={styles.app}>
      <Header
        paused={paused}
        onPauseToggle={() =>
          setIsPaused({ ...isPaused, global: !isPaused.global })
        }
        socketStatus={socketStatus}
      />

      {tweetIds.length > 0 && (
        <div className="tweets-container">
          {tweetIds.map((tweetId) => (
            <TweetItem
              key={tweetId}
              tweetId={tweetId}
              getTweetById={getTweetById}
              isPaused={isPaused}
              onLocalPauseChange={(paused) =>
                setIsPaused({ ...isPaused, local: paused })
              }
              onGlobalPauseChange={(paused) =>
                setIsPaused({ ...isPaused, global: paused })
              }
            />
          ))}
        </div>
      )}

      <Settings />
    </div>
  );
}

export default App;
