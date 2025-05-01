import { useEffect, useState } from "react";

import Settings from "@/components/Settings";
import TweetContainer from "@/components/TweetContainer";
import Header from "@/components/Header";

import useWebSockets from "@/hooks/useWebSockets";

import styles from "@/app.module.css";

import {
  IApiSettings,
  ILaunchSettings,
  IPaused,
} from "@/interfaces/index.interface";


function App() {
  const [isPaused, setIsPaused] = useState<IPaused>({
    global: false,
    local: false,
  });

  const [apiSettings, setApiSettings] = useState<IApiSettings>({
    apiToken: "",
    listId: "",
    openAIKey: "",
  });

  const [launchSettings, setLaunchSettings] = useState<ILaunchSettings>({
    walletPublicKey: "",
    walletPrivateKey: "",
    defaultBuyAmount: "",
    tokenKey: "",
  });

  const { tweets, pause, resume } = useWebSockets({
    listId: apiSettings.listId,
    apiToken: apiSettings.apiToken,
  });

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
              openAIKey={apiSettings.openAIKey}
              launchSettings={launchSettings}
            />
          ))}
        </div>
      )}

      <Settings
        apiSettingsConfig={apiSettings}
        setApiSettingsConfig={setApiSettings}
        launchSettingsConfig={launchSettings}
        setLaunchSettingsConfig={setLaunchSettings}
      />
    </div>
  );
}

export default App;
