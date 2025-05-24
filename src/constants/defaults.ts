import { ILaunchType } from "@/interfaces/index.interface";

export const DEFAULT_API_SETTINGS = {
  apiToken: "",
  listId: "",
  openAIKey: "",
  openAIModel: "gpt-4.1-mini",
};

export const DEFAULT_LAUNCH_SETTINGS = {
  walletPublicKey: "",
  walletPrivateKey: "",
  walletApiKey: "",
  defaultBuyAmount: "",
  express1BuyAmount: "",
  express2BuyAmount: "",
  tokenPublicKey: "",
  tokenPrivateKey: "",
  launchType: ILaunchType.LOCAL,
};
