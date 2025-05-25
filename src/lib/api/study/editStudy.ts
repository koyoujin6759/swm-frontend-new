import { API_ENDPOINTS } from '@/lib/api/endpoints';
import axios from 'axios';
import { ApiResponse, EditStudyRequest } from '@/types/api/study-recruit/editStudy';


export const editStudy = async (
  studyId: string,
  studyData: EditStudyRequest,
): Promise<ApiResponse> => {
  // 이미지 개수 제한 체크
  if (studyData.modifyImageRequest?.imageUrlsToAdd) {
    if (studyData.modifyImageRequest.imageUrlsToAdd.length > 10) {
      throw new Error('이미지는 최대 10개까지만 추가할 수 있습니다.');
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${API_ENDPOINTS.STUDY.PATCH(studyId)}`;
  
  console.log('스터디 수정 요청 데이터:', {
    url, 
    studyData: JSON.stringify(studyData, null, 2)
  });

  try {
    const res = await axios.patch(url, studyData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    console.log('스터디 수정 응답:', res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('스터디 수정 실패 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.response?.data?.message,
        details: error.response?.data?.data
      });
    }
    throw error;
  }
};

// 스터디 모집 상태수정
export const updateStudyStatus = async (studyId: string, status: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${API_ENDPOINTS.STUDY.STATUS(studyId)}`;
  const res = await axios.patch(url, { status }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return res.data;
};

