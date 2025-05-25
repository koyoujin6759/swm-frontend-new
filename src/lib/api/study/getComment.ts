import { API_ENDPOINTS } from '@/lib/api/endpoints';
import axios from 'axios';
import { ApiResponse, Comment } from '@/types/api/study-recruit/getComment';
import { ApiReplyResponse, Reply } from '@/types/api/study-recruit/getReply';

// 댓글 조회
export const getComment = async (studyId: string, pageNo: number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.COMMENT(studyId)}`;
    const res = await axios.get<ApiResponse<Comment>>(url, {
      params: { pageNo },
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (studyId: string, commentId: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.DELETE_COMMENT(studyId, commentId)}`;
    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// 댓글 수정
export const editComment = async (commentId: string, content: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.PATCH_COMMENT(commentId)}`;
    const res = await axios.patch(
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

// 답글 조회
export const getReply = async (
  parentId: string,
  params: { lastReplyId: number },
) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${API_ENDPOINTS.STUDY.REPLY(parentId)}`;
    // console.log('url', url);
    const res = await axios.get<ApiReplyResponse<Reply>>(url, {
      params,
    });
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
