import axios from "axios";

import environment from "@/constants/environment";

import { IAnalysis } from "@/interfaces/index.interface";

interface IAnalyzeResponse {
  success: boolean;
  analysis: IAnalysis;
}

interface IAnalyzeTweet {
  text: string | null;
  imageUrl: string | null;
  openAIKey: string;
}

export const analyzeTweet = async ({
  text,
  imageUrl,
  openAIKey,
}: IAnalyzeTweet) => {
  try {
    const response = await axios.post<IAnalyzeResponse>(
      `${environment.apiUrl}/analyze`,
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
