import axios from "axios";

import environment from "@/constants/environment";

interface ILaunchToken {
  // publicKey: string;
  // privateKey: string;
  walletApiKey: string;
  tokenName: string;
  tickerName: string;
  twitterUrl: string;
  tokenKey: string;
  buyAmount: number;
  imageUrl: string;
}

export const launchToken = async ({
  // publicKey,
  // privateKey,
  walletApiKey,
  tokenName,
  tickerName,
  twitterUrl,
  tokenKey,
  buyAmount,
  imageUrl,
}: ILaunchToken) => {
  try {
    const response = await axios.post(`${environment.apiUrl}/launch`, {
      // publicKey,
      // privateKey,
      apiKey: walletApiKey,
      tokenName,
      tickerName,
      twitterUrl,
      imageUrl,
      tokenKey,
      buyAmount,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    alert("Failed to launch token");
    return null;
  }
};
