import { FC, useState } from "react";

import ManualLaunch from "@/components/TweetContainer/TweetActions/ManualLaunch";
import ExpressLaunch from "@/components/TweetContainer/TweetActions/ExpressLaunch";
import AiLaunch from "@/components/TweetContainer/TweetActions/AiLaunch";
import ExpressParseLaunch from "@/components/TweetContainer/TweetActions/ExpressParseLaunch";
import LaunchSuccess from "@/components/TweetContainer/TweetActions/LaunchSuccess";
import styles from "@/components/TweetContainer/TweetActions/index.module.css";

import { STORAGE_KEYS } from "@/constants/storage";
import {
  DEFAULT_LAUNCH_SETTINGS,
  DEFAULT_API_SETTINGS,
} from "@/constants/defaults";
import environment from "@/constants/environment";

import storage from "@/utils/storage";
import { mapInternalTweet } from "@/utils/tweet";

import {
  ITweet,
  ILaunchSettings,
  ILaunchSuccess,
  IApiSettings,
  IPaused,
  IAnalysis,
} from "@/interfaces/index.interface";
import CustomAiExpressLaunch from "./CustomAiExpressLaunch";
interface TweetActionsProps {
  onGlobalPauseChange: (isPaused: boolean) => void;
  tweet: ITweet;
  isPaused: IPaused;
  onLocalPauseChange: (isPaused: boolean) => void;
  customAnalysis: IAnalysis | null;
  customAnalysisLoading: boolean;
}

export const TweetActions: FC<TweetActionsProps> = ({
  tweet,
  onGlobalPauseChange,
  isPaused,
  onLocalPauseChange,
  customAnalysis,
  customAnalysisLoading,
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
    onGlobalPauseChange,
    launchSettings,
    onLaunchSuccess: (ls: ILaunchSuccess | null) => {
      setLaunchSuccess(ls);

      const launchUrl = new URL(environment.launchUrl);
      launchUrl.searchParams.append("chainId", environment.launchChainId);
      launchUrl.searchParams.append("address", launchSettings.tokenPublicKey);

      const launch2Url = new URL(environment.launch2Url);

      window.open(
        launch2Url.toString() + `/${launchSettings.tokenPublicKey}`,
        "_blank",
        "noopener,noreferrer"
      );
      window.open(launchUrl.toString(), "_blank", "noopener,noreferrer");
    },
  };

  const hasInternalTweet = tweet.quotedTweet || tweet.inReplyToTweet;

  let internalTweet: ITweet | null = null;

  if (hasInternalTweet) {
    if (tweet.inReplyToTweet)
      internalTweet = mapInternalTweet(tweet.inReplyToTweet);
    else if (tweet.quotedTweet)
      internalTweet = mapInternalTweet(tweet.quotedTweet);
  }

  return (
    <div
      className={styles.tweetActions}
      onMouseEnter={() => !isPaused.global && onLocalPauseChange(true)}
      onMouseLeave={() => !isPaused.global && onLocalPauseChange(false)}
    >
      <ManualLaunch {...commonProps} tweet={tweet} />
      <AiLaunch
        {...commonProps}
        openAIKey={openAIKey}
        title="AI"
        tweet={tweet}
      />

      <ExpressLaunch
        {...commonProps}
        openAIKey={openAIKey}
        title="Exp 1"
        buyAmount={Number(launchSettings.express1BuyAmount)}
        tweet={tweet}
      />

      <ExpressLaunch
        {...commonProps}
        openAIKey={openAIKey}
        title="Exp 2"
        buyAmount={Number(launchSettings.express2BuyAmount)}
        tweet={tweet}
      />

      <div className={styles.customAiExpress}>
        <CustomAiExpressLaunch
          {...commonProps}
          customAnalysis={customAnalysis}
          customAnalysisLoading={customAnalysisLoading}
          tweet={tweet}
        />
      </div>
      <ExpressParseLaunch
        {...commonProps}
        title="Exp Parse"
        tweet={tweet}
        buyAmount={Number(launchSettings.express1BuyAmount)}
      />

      {hasInternalTweet && (
        <>
          <AiLaunch
            {...commonProps}
            openAIKey={openAIKey}
            title="R AI"
            tweet={internalTweet}
          />

          <ExpressLaunch
            {...commonProps}
            openAIKey={openAIKey}
            title="R Exp 1"
            buyAmount={Number(launchSettings.express1BuyAmount)}
            tweet={internalTweet}
          />

          <ExpressLaunch
            {...commonProps}
            openAIKey={openAIKey}
            title="R Exp 2"
            buyAmount={Number(launchSettings.express2BuyAmount)}
            tweet={internalTweet}
          />
        </>
      )}

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
