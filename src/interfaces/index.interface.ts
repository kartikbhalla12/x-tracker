export interface IApiSettings {
  apiToken: string;
  listId: string;
  openAIKey: string;
}

export interface ILaunchSettings {
  walletPublicKey: string;
  walletPrivateKey: string;
  defaultBuyAmount: string;
  tokenPublicKey: string;
  tokenPrivateKey: string;
}

export interface IPaused {
  global: boolean;
  local: boolean;
}

export interface IInnerTweet {
  id: string;
  text: string;
  url: string;
  attachedUrl: string | null;
  attachedUrlMetadata: {
    title: string;
    description: string;
    image: string;
  };
  attachedMedia: string[] | null;
  author: {
    name: string;
    username: string;
    profilePicture: string | null;
  };
  createdAt: string;
}

export interface ITweet extends IInnerTweet {
  quotedTweet: IInnerTweet | null;
  inReplyToTweet: IInnerTweet | null;
}

export enum InnerTweetType {
  quoted = "Quoted Tweet",
  replied = "Replied To",
}

export interface IPaused {
  global: boolean;
  local: boolean;
}

export interface IMetaData {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface IAnalysis {
  tokenName: string;
  ticker: string;
}

export interface ILaunchSuccess {
  tokenName: string;
  tickerName: string;
}

export enum ISocketStatus {
  CONNECTED,
  DISCONNECTED
} 


