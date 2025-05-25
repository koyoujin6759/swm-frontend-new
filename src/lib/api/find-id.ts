import axiosInstance from './axios';
import { API_ENDPOINTS } from './endpoints';

export const findId = async (name: string, loginId: string) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.FIND_ID, {
      loginId: loginId,
      name: name,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
