import { API_ENDPOINTS } from '@/lib/api/endpoints';
import axios from 'axios';
import {
  ApiResponse,
  PostCommentResponse,
} from '@/types/api/study-recruit/postComment';

export const postComment = async (
  studyId: string,
  content: string,
): Promise<ApiResponse<PostCommentResponse>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.COMMENT(studyId)}`;
    const res = await axios.post(
      url,
      { content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const postReply = async (
  studyId: string,
  parentId: string,
  content: string,
): Promise<ApiResponse<PostCommentResponse>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.CREATE_REPLY(studyId, parentId)}`;
    const res = await axios.post(
      url,
      { content },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
    