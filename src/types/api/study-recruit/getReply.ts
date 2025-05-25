export interface ApiReplyResponse<T> {
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
export interface Reply {
  commentId: number;
  content: string;
  userId: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}
