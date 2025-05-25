import {
  RecruitmentPositionTitle,
  StudyCategory,
  StudyStatus,
} from '@/types/api/study-recruit/study';

export interface ApiResponse {
  message: string;
  data: StudyDetailRequest;
}

export interface GetTagResponse {
  tagId: number;
  name: string;
}

export interface GetImageResponse {
  imageId: number;
  imageUrl: string | null;
}

export interface GetRecruitmentPositionResponse {
  recruitmentPositionId: number;
  title: RecruitmentPositionTitle;
  headcount: number;
  acceptedCount: number;
  participatedCount: number;
}

export interface StudyDetailRequest {
  studyId: number;
  title: string;
  content: string;
  category: StudyCategory;
  likeCount: number;
  commentCount: number;
  status: StudyStatus;
  viewCount: number;
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  likeStatus: boolean;
  openChatUrl: string;
  studyBookmarkId: string | null;
  getTagResponses: GetTagResponse[];
  getImageResponses: GetImageResponse[];
  getRecruitmentPositionResponses: GetRecruitmentPositionResponse[]; 
  pageCommentResponse: {
    numberOfElements: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    data: {
      commentId: number;
      content: string;
      userId: string;
      nickname: string;
      profileImageUrl: string | null;
      createdAt: string | number[];
      updatedAt: string;
      replyCount: number;
    }[];
  };
  getStudyParticipationStatusResponse: {
    participationId: number;
    status: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}
