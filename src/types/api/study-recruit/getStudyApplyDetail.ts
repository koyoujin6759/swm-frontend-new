export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface StudyApplyDetailResponse {
    participationId: number;
    kakaoId: string;
    status: string;
    coverLetter: string;
    fileInfo: {
      fileUrl: string;
      fileName: string;
    },
    links: string[];
    userId: string;
    profileImageUrl: string;
    nickname: string;
}
