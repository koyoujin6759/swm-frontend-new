export interface InteractionStatusProps extends InteractionResponse {
  studyId: string;
  likeStatus: boolean;
}

export interface InteractionResponse {
  likeCount: number;
  commentCount: number;
  viewCount: number;
}
