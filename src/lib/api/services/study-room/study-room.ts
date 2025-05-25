import axiosInstance, { publicAxiosInstance } from '@/lib/api/axios';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import {
  CreateStudyRoomReq,
  LikeResponse,
  StudyRoomListParams,
  StudyRoomListResponse,
  UnlikeResponse,
} from '@/types/api';

export const StudyRoomService = {
  getStudyRoomList: async ({
    queryParams,
  }: {
    queryParams: StudyRoomListParams;
  }): Promise<StudyRoomListResponse> => {
    const params = {
      ...queryParams,
      options: queryParams.options?.join(','),
    };

    // TODO: util 함수로 빼기
    const cleanParams = Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string | number> & StudyRoomListParams,
    );

    const response = await publicAxiosInstance.get<StudyRoomListResponse>(
      API_ENDPOINTS.STUDY_ROOM.LIST,
      {
        params: cleanParams,
      },
    );
    return response.data;
  },

  like: async (studyRoomId: number): Promise<LikeResponse> => {
    const url = API_ENDPOINTS.STUDY_ROOM.LIKE.replace(
      ':studyRoomId',
      String(studyRoomId),
    );
    const response = await publicAxiosInstance.post<LikeResponse>(url);
    return response.data;
  },

  unlike: async (studyRoomId: number): Promise<UnlikeResponse> => {
    const url = API_ENDPOINTS.STUDY_ROOM.UNLIKE.replace(
      ':studyRoomId',
      String(studyRoomId),
    );
    const response = await publicAxiosInstance.delete<UnlikeResponse>(url);
    return response.data;
  },

  createStudyRoom: async (createStudyRoomReq: CreateStudyRoomReq) => {
    const response = await axiosInstance.post<CreateStudyRoomReq>(
      API_ENDPOINTS.STUDY_ROOM.CREATE,
      createStudyRoomReq,
    );
    return response.data;
  },
};
