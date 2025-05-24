import axios from "axios";

import environment from "@/constants/environment";

interface IGetIpfsMetadataUriResponse {
  success: boolean;
  metadataUri: string;
}

interface IGetIpfsMetadataUri {
  tokenName: string;
  tickerName: string;
  twitterUrl: string;
  imageUrl: string;
}

export const getIpfsMetadataUri = async ({
  imageUrl,
  tickerName,
  tokenName,
  twitterUrl,
}: IGetIpfsMetadataUri) => {
  try {
    const response = await axios.get<IGetIpfsMetadataUriResponse>(
      `${environment.apiUrl}/ipfs`,
      {
        params: {
          tokenName,
          tickerName,
          twitterUrl,
          imageUrl,
        },
      }
    );

    return response.data?.metadataUri || null;
  } catch (error) {
    console.error(error);
    alert("Failed to get IPFS metadata URI");
    return null;
  }
};
