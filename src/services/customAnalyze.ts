import axios from "axios";

import environment from "@/constants/environment";

import { IAnalysis } from "@/interfaces/index.interface";

interface ICustomAnalyzeResponse {
  success: boolean;
  analysis: IAnalysis;
}

interface ICustomAnalyzeTweet {
  text: string | null;
  imageUrl: string | null;
  openAIKey: string;
}

export const customAnalyzeTweet = async ({
  text,
  imageUrl,
  openAIKey,
}: ICustomAnalyzeTweet) => {
  try {
    const response = await axios.post<ICustomAnalyzeResponse>(
      `${environment.apiUrl}/analyze-custom`,
      {
        tweetText: text,
        tweetImageUrl: imageUrl,
        openAIKey,
      }
    );

    return response.data?.analysis || null;
  } catch (error) {
    console.error(error);
    alert("Failed to analyze tweet");
    return null;
  }
};
