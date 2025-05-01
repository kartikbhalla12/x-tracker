import { IMetaData } from "@/interfaces/index.interface";
import axios from "axios";

import environment from "@/constants/environment";

interface IMetaDataResponse {
  success: boolean;
  metadata: IMetaData;
}

export const getMetadata = async (url: string) => {
  try {
    const response = await axios.get<IMetaDataResponse>(`${environment.apiUrl}/metadata`, {
      params: { url },
    });

    return response.data?.metadata || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
