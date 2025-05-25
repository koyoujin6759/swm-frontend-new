import { API_ENDPOINTS } from '../endpoints';
import axios from 'axios';
import { ApiResponse } from '@/types/api/study-recruit/getStudyDetail';

export const getStudyDetail = async (studyId: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.DETAIL(studyId)}`;

    console.log('스터디 상세 조회 요청 URL:', url);
    console.log('스터디 ID:', studyId); 

    const token = localStorage.getItem('accessToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await axios.get<ApiResponse>(url, { headers });

    return res.data;
  } catch (error) {
    console.error('스터디 상세 조회 실패:', error);
    throw error;
  }
};

//스터디 삭제
export const deleteStudy = async (studyId: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.DELETE(studyId)}`;

    console.log('스터디 삭제 요청 URL:', url);
    console.log('스터디 ID:', studyId);

    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('스터디 삭제 실패:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      if (error.response?.status === 401) {
        throw new Error('로그인이 필요합니다.');
      } else if (error.response?.status === 403) {
        throw new Error('삭제 권한이 없습니다.');
      }
    }
    throw new Error('스터디 삭제에 실패했습니다.');
  }
};
