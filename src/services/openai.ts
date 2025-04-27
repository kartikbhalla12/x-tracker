import axios from 'axios';
import OpenAI from 'openai';


export interface TokenAnalysis {
  tokenName: string;
  ticker: string;
}


export const loadPromptFromGoogleDocs = async (docId: string): Promise<string> => {
  try {
    // Convert the Google Docs URL to a format that can be accessed via the Google Docs API
    const response = await axios.get(`https://docs.google.com/document/d/${docId}/export?format=txt`);
    return response.data;
  } catch (error) {
    console.error('Error loading prompt from Google Docs:', error);
    throw new Error('Failed to load prompt from Google Docs');
  }
}; 

let systemPrompt: string | null = null;

const loadInitialPrompt = async () => {
  systemPrompt = await loadPromptFromGoogleDocs('1yfjlNdcZjR8V1jxKFHboRFOqdKTMhnFIG45bKPO-oeo');
}

loadInitialPrompt();



export const analyzeTweet = async (tweetText: string, tweetImageUrl: string, openAIKey: string): Promise<TokenAnalysis | null> => {
  const openai = new OpenAI({
    apiKey: openAIKey,
    dangerouslyAllowBrowser: true
  });

  console.log('tweetText', tweetText);
  console.log('tweetImageUrl', tweetImageUrl);
  
  const customPrompt = `
  ${systemPrompt}
  
  Analyze the following tweet and attached image URL carefully and return a JSON object with the token name and ticker.
    Tweet: ${tweetText || "[No tweet text provided]"}
    Image URL: ${tweetImageUrl || "[No image URL provided]"}
  `;

  if (!systemPrompt) {
    console.error('System prompt not loaded');
    return null;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: customPrompt
            },
            {
              type: "image_url",
              image_url: {url: tweetImageUrl}
            }
          ]
        }
      ],
      model: "gpt-4o",
      temperature: 0.3,
      response_format: {
    type: 'json_object',
  },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Error analyzing tweet:', error);
    // return {
    //   name: null,
    //   ticker: null,
    //   description: null,
    //   confidence: 0
    // };
    return null;
  }
}; 