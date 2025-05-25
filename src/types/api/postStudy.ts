import { RecruitmentPositionTitle, StudyCategory } from './study';

export interface ApiResponse {
  message: string;
  data: CreateStudyRequest;
}

export interface CreateStudyRequest {
  title: string;
  content: string;
  openChatUrl: string;
  category: StudyCategory;
  tags?: string[];
  imageUrls?: string[];
  createRecruitmentPositionRequests: {
    title: RecruitmentPositionTitle;
    headcount: number;
  }[];
}
