import { FC, useState } from "react";

import ManualLaunch from "@/components/TweetContainer/TweetActions/ManualLaunch";
import ExpressLaunch from "@/components/TweetContainer/TweetActions/ExpressLaunch";
import AiLaunch from "@/components/TweetContainer/TweetActions/AiLaunch";
import styles from "@/components/TweetContainer/TweetActions/index.module.css";
import LaunchSuccess from "@/components/TweetContainer/TweetActions/LaunchSuccess";

import { STORAGE_KEYS } from "@/constants/storage";
import {
  DEFAULT_LAUNCH_SETTINGS,
  DEFAULT_API_SETTINGS,
} from "@/constants/defaults";

import storage from "@/utils/storage";

import {
  ITweet,
  ILaunchSettings,
  ILaunchSuccess,
  IApiSettings,
} from "@/interfaces/index.interface";
import environment from "@/constants/environment";
interface TweetActionsProps {
  onGlobalPauseChange: (isPaused: boolean) => void;
  tweet: ITweet;
}

export const TweetActions: FC<TweetActionsProps> = ({
  tweet,
  onGlobalPauseChange,
}) => {
  const [launchSuccess, setLaunchSuccess] = useState<ILaunchSuccess | null>(
    null
  );

  const { openAIKey } =
    storage.get<IApiSettings>(STORAGE_KEYS.API_SETTINGS) ||
    DEFAULT_API_SETTINGS;

  const launchSettings =
    storage.get<ILaunchSettings>(STORAGE_KEYS.LAUNCH_SETTINGS) ||
    DEFAULT_LAUNCH_SETTINGS;

  const commonProps = {
    tweet,
    onGlobalPauseChange,
    launchSettings,
    onLaunchSuccess: (ls: ILaunchSuccess | null) => {
      setLaunchSuccess(ls);

      const launchUrl = new URL(environment.launchUrl);
      launchUrl.searchParams.append("chainId", environment.launchChainId);
      launchUrl.searchParams.append("address", launchSettings.tokenPublicKey);

      window.open(launchUrl.toString(), "_blank", "noopener,noreferrer");
    },
  };

  return (
    <div className={styles.tweetActions}>
      <AiLaunch {...commonProps} openAIKey={openAIKey} />
      <ExpressLaunch
        {...commonProps}
        openAIKey={openAIKey}
        title="Express 1 Launch"
        buyAmount={Number(launchSettings.express1BuyAmount)}
      />
      <ExpressLaunch
        {...commonProps}
        openAIKey={openAIKey}
        title="Express 2 Launch"
        buyAmount={Number(launchSettings.express2BuyAmount)}
      />
      <ManualLaunch {...commonProps} />

      <LaunchSuccess
        tokenName={launchSuccess?.tokenName || ""}
        tickerName={launchSuccess?.tickerName || ""}
        onClose={() => setLaunchSuccess(null)}
        open={!!launchSuccess}
      />
    </div>
  );
};

export default TweetActions;
