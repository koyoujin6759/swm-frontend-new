// 스터디 모집 상태 수정
export interface ApiResponse {
    message: string;
    data: UpdateStudyStatusRequest;
  }
  
  export interface UpdateStudyStatusRequest {
    status: string;
  }
  