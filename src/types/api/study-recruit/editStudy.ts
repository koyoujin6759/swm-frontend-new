import { StudyCategory } from '@/types/api/study-recruit/study';

export interface ApiResponse {
  message: string;
  data: EditStudyRequest;
}

export interface EditStudyRequest {
  title: string;
  content: string;
  openChatUrl: string;
  category: StudyCategory;
  modifyTagRequest?: {
    tagsToAdd: string[];
    tagIdsToRemove: number[];
  };
  modifyImageRequest?: {
    imageUrlsToAdd: string[];
    imageIdsToRemove: number[];
  }; 
}
