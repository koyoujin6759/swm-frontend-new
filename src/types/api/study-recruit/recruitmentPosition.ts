// 스터디 참여 신청 상태
export enum StudyParticipationStatus {
  PENDING = 'PENDING', // 신청대기
  ACCEPTED = 'ACCEPTED', // 신청승인
  REJECTED = 'REJECTED', // 거절
}

export function getStatusClass(status: StudyParticipationStatus) {
  switch (status) {   
      case StudyParticipationStatus.PENDING:
      return 'bg-[#E7F3FF] text-[#4998E9]';
      case StudyParticipationStatus.ACCEPTED:
      return 'bg-[#4998E9] text-white';
      case StudyParticipationStatus.REJECTED:
      return 'bg-[#e9e9e9] text-[#565656]';
      default:
      return 'bg-gray-200 text-gray-500';
  }
}

export const STATUS_LABELS: Record<StudyParticipationStatus, string> = {
  [StudyParticipationStatus.PENDING]: '신청대기',
  [StudyParticipationStatus.ACCEPTED]: '신청승인',
  [StudyParticipationStatus.REJECTED]: '거절',
};

export const getStatusSortOptions = () => [
  ...Object.entries(STATUS_LABELS).map(([value, label], index) => ({
    id: index + 1,
    value,
    label,
  })),
];
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// 스터디 모집 포지션 수정 응답
export interface EditRecruitmentPositionResponse {
  recruitmentPositionId: number;
  title: string;
  headcount: number;
}

// 스터디 모집 포지션 수정 요청
export interface EditRecruitmentPositionRequest {
  createRecruitmentPositionRequests: {
    title: string;
    headcount: number;
  }[];
  updateRecruitmentPositionRequests: {
    recruitmentPositionId: number;
    title: string;
    headcount: number;
  }[];
  recruitmentPositionIdsToRemove: number[]; 
  }

// 스터디 모집 참여 신청 
export interface ApplyRecruitmentPositionRequest {
  kakaoId: string;
  coverLetter: string;
  links?: string[];
  fileInfo?: {
    fileUrl: string;
    fileName: string;
  }
}
   
// 스터디 참여 조회 응답 (작성자전용)
export interface GetStudyParticipationResponse {
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  data: {
    participationId: number;
    status: StudyParticipationStatus;
    coverLetter: string;
    userId: string;
    profileImageUrl: string;
    nickname: string;
  }[];
}

// 스터디 참여 조회 요청 (작성자전용)
export interface GetStudyParticipationRequest {
  status?: StudyParticipationStatus;
  pageNo: number; 
}

// 스터디 참여 상태 수정 요청
export interface ChangeStudyParticipationStatusRequest {
  kakaoId: string; 
}