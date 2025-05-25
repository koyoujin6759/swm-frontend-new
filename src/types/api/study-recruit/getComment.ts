export interface ApiResponse<T> {
  message: string;
  data: PaginationResponse<T>;
}

export interface PaginationResponse<T> {
  data: T[];
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}
export interface Comment {
  commentId: number;
  content: string;
  userId: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
}
 