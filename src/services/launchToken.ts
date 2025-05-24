import axios from "axios";

import environment from "@/constants/environment";
import { ILaunchType } from "@/interfaces/index.interface";

interface ILaunchToken {
  publicKey: string;
  privateKey: string;
  walletApiKey: string;
  tokenName: string;
  tickerName: string;
  // twitterUrl: string;
  tokenKey: string;
  buyAmount: number;
  // imageUrl: string;
  metadataUri: string;
  launchType: ILaunchType;
}

export const launchToken = async ({
  publicKey,
  privateKey,
  walletApiKey,
  tokenName,
  tickerName,
  // twitterUrl,
  tokenKey,
  buyAmount,
  // imageUrl,
  metadataUri,
  launchType,
}: ILaunchToken) => {
  try {
    const response = await axios.post(`${environment.apiUrl}/launch`, {
      publicKey,
      privateKey,
      apiKey: walletApiKey,
      tokenName,
      tickerName,
      // twitterUrl,
      // imageUrl,
      metadataUri,
      tokenKey,
      buyAmount,
      launchType,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    alert("Failed to launch token");
    return null;
  }
};
