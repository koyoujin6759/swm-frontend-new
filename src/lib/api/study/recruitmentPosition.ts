import { API_ENDPOINTS } from '@/lib/api/endpoints';
import axios from 'axios';
import { ApiResponse, EditRecruitmentPositionResponse, EditRecruitmentPositionRequest, ApplyRecruitmentPositionRequest, GetStudyParticipationResponse, GetStudyParticipationRequest, StudyParticipationStatus, ChangeStudyParticipationStatusRequest } from '@/types/api/study-recruit/recruitmentPosition';  

// 스터디 모집 포지션 수정
export const editRecruitmentPosition = async (studyId: string, positionData: EditRecruitmentPositionRequest): Promise<ApiResponse<EditRecruitmentPositionResponse>> => {
    try {
        console.log('positionData', positionData);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = `${baseUrl}${API_ENDPOINTS.STUDY.EDIT_POSITION(studyId)}`; 

        const response = await axios.patch(url,
            positionData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};   

// 스터디 모집 참여 신청
export const applyRecruitmentPosition = async (recruitmentPositionId: string, applyData: ApplyRecruitmentPositionRequest): Promise<ApiResponse<null>> => {
    try { 
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const url = `${baseUrl}${API_ENDPOINTS.STUDY.APPLY(recruitmentPositionId)}`; 
        const response = await axios.post(url, applyData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }); 
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// 스터디 참여신청 포지션 변경
export const changeRecruitmentPosition = async (
  recruitmentPositionId: string,
  participationId: string
): Promise<ApiResponse<null>> => {
  try {
    // 인증 토큰 확인
    const token = localStorage.getItem('accessToken');  
    if (!token) {
      throw new Error('로그인이 필요합니다');
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.APPLY_POSITION_CHANGE(recruitmentPositionId, participationId)}`; 
    const response = await axios.patch<ApiResponse<null>>(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    // 오류 상세 정보 출력
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message
      });
      
      // 401 오류인 경우 토큰 관련 정보 출력
      if (error.response?.status === 401) {
        console.error('Authentication failed. Token may be expired or invalid.');
        // 토큰 상태 확인
        const token = localStorage.getItem('accessToken');
        console.error('Token exists:', !!token);
        if (token) {
          try {
            // 토큰이 JWT 형식인지 확인 (디버깅용)
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.error('Token payload:', payload);
              console.error('Token expiration:', new Date(payload.exp * 1000));
              console.error('Current time:', new Date());
              console.error('Token expired:', payload.exp * 1000 < Date.now());
            }
          } catch (e) {
            console.error('Failed to parse token:', e);
          }
        }
      }
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};

// 스터디 참여 조회 (작성자전용)
export const getStudyParticipation = async (recruitmentPositionId: string, queryData: GetStudyParticipationRequest): Promise<ApiResponse<GetStudyParticipationResponse>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.APPLY(recruitmentPositionId)}`;  
    // console.log('queryData', queryData);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      params: queryData,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 스터디 참여 상태 수정
export const changeStudyParticipationStatus = async (participationId: string, status: StudyParticipationStatus): Promise<ApiResponse<ChangeStudyParticipationStatusRequest>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.APPLY_STATUS_CHANGE(participationId)}`;
    const response = await axios.patch(url, {
      status,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
