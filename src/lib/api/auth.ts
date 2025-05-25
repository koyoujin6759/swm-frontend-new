import { axiosInstance } from './axios';
import { API_ENDPOINTS } from './endpoints';
import axios from 'axios';
import { UserInfoResponse } from '@/types/api/user-info';

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
      loginId: email,
      password: password,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  const clearAuthData = () => {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken');
  };

  const token = localStorage.getItem('accessToken');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  try {
    await axiosInstance.patch(API_ENDPOINTS.AUTH.LOGOUT);
    clearAuthData();
    return { success: true };
  } catch {
    clearAuthData();
    return { success: true };
  }
};

export async function getUserInfo(): Promise<UserInfoResponse> {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return {
      data: undefined,
      message: 'Not logged in',
    } as UserInfoResponse;
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.USER.INFO}`;
    const res = await axios.get<UserInfoResponse>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error fetching user info:',
        error.response?.data || error.message,
      );
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
