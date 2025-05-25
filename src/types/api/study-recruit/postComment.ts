export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PostCommentResponse {
  commentId: number;
  createdAt: string;
} 