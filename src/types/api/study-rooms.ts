export interface ApiResponse<T> {
  message: string;
  data: PaginatedResponse<T>;
}

export interface StudyRoom {
    studyRoomId: number;
    title: string;
    thumbnail: string;
    locality: string;
    phoneNumber: string;
    likeCount: number;
    reviewCount: number;
    entireMinPricePerHour: number;
    entireMaxHeadcount: number;
    starAvg: number;
    studyBookmarkId: number | null;
    tags: {
      studyRoomTagId: number;
      tag: string;
    }[];
  }
  
  export type StudyRoomResponse = ApiResponse<StudyRoom>;
  
  export interface PaginatedResponse<T> {
    numberOfElements: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    data: T[];
}
