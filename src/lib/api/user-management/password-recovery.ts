import { axiosInstance } from '@/lib/api/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export const sendPasswordAuthCode = async (loginId: string) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.USER.SEND_PASSWORD_AUTH_CODE,
    {
      loginId: loginId,
    },
  );

  return response.data;
};

export const checkPasswordAuthCode = async (
  loginId: string,
  authCode: string,
) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.USER.CHECK_PASSWORD_AUTH_CODE,
    {
      loginId: loginId,
      authCode: authCode,
    },
  );

  return response.data;
};

export const resetPassword = async (loginId: string, newPassword: string) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.USER.RESET_PASSWORD,
    {
      loginId: loginId,
      newPassword: newPassword,
    },
  );

  return response.data;
};
