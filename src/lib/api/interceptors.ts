import { AxiosError, AxiosInstance } from 'axios';
import { ApiErrorResponse } from '@/types/common/index';
import { devLog } from '@/utils/dev-log';
import { getDefaultErrorMessage } from '@/utils/get-http-error-message';

const createCustomError = (error: AxiosError<ApiErrorResponse>) => {
  return {
    code: error.response?.data?.code || 'UNKNOWN_ERROR',
    message: error.response?.data?.message || getDefaultErrorMessage(error.response?.status),
    messageClient: error.response?.data?.messageClient,
    path: error.response?.data?.path || error.response?.config?.url || '',
    status: false
  };
};

const responseInterceptor = (error: AxiosError<ApiErrorResponse>) => {
  devLog.error('axiosInstance.interceptors.response.error', error);
  if (error.response) {
    throw createCustomError(error);
  }
};

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      // TODO: 토큰 발급 엔드포인트 설정 추가
      
      config.headers['Content-Type'] = 'application/json';
      // config.headers.Authorization = `Bearer ${encodeURIComponent(token)}`;
      
      return config;
    },
    (error) => {
      devLog.error('axiosInstance.interceptors.request.error', error);
      throw createCustomError(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    responseInterceptor
  );
};

export const setupPublicInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      devLog.error('publicAxiosInstance.interceptors.request.error', error);
      throw createCustomError(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    responseInterceptor
  );
};