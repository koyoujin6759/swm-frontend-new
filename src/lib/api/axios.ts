import Axios from 'axios';
import { setupInterceptors, setupPublicInterceptors } from '@/lib/api/interceptors';
import { DEV_DOMAIN } from '@/constants/domain';

export const axiosInstance = Axios.create({
  baseURL: DEV_DOMAIN.API,
});

export const publicAxiosInstance = Axios.create({
  baseURL: DEV_DOMAIN.API,
});

setupInterceptors(axiosInstance);
setupPublicInterceptors(publicAxiosInstance);

export default axiosInstance;