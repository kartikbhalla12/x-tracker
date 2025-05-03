import { useEffect, useState } from "react";

import Settings from "@/components/Settings";
import TweetContainer from "@/components/TweetContainer";
import Header from "@/components/Header";

import useWebSockets from "@/hooks/useWebSockets";

import styles from "@/app.module.css";

import { IPaused } from "@/interfaces/index.interface";

function App() {
  const [isPaused, setIsPaused] = useState<IPaused>({
    global: false,
    local: false,
  });

  const { tweets, pause, resume, socketStatus } = useWebSockets();

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

      {tweets.length > 0 && (
        <div className="tweets-container">
          {tweets.map((tweet) => (
            <TweetContainer
              key={tweet.id}
              tweet={tweet}
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
