export enum RecruitmentPositionTitle {
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  ETC = 'ETC',
}

export const POSITION_LABELS: Record<RecruitmentPositionTitle, string> = {
  [RecruitmentPositionTitle.BACKEND]: '백엔드',
  [RecruitmentPositionTitle.FRONTEND]: '프론트엔드',
  [RecruitmentPositionTitle.ETC]: '기타',
};

export const getPositionOptions = () => [
  { id: 0, value: 'ALL', label: '직무 전체' },
  ...Object.entries(RecruitmentPositionTitle).map(([, value], index) => ({
    id: index + 1,
    value,
    label: POSITION_LABELS[value as RecruitmentPositionTitle],
  })),
];

export enum StudyCategory {
  ALGORITHM = 'ALGORITHM',
  DEVELOPMENT = 'DEVELOPMENT',
}

export const CATEGORY_LABELS: Record<StudyCategory, string> = {
  [StudyCategory.ALGORITHM]: '알고리즘',
  [StudyCategory.DEVELOPMENT]: '개발',
};

export const getCategoryList = () =>
  Object.entries(StudyCategory).map(([, value], index) => ({
    id: index + 1,
    name: CATEGORY_LABELS[value as StudyCategory],
    value: value,
  }));

export const getCategoryOptions = () => [
  { id: 0, value: 'ALL', label: '카테고리 전체' },
  ...Object.entries(StudyCategory).map(([, value], index) => ({
    id: index + 1,
    value,
    label: CATEGORY_LABELS[value as StudyCategory],
  })),
];

export enum StudyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const STATUS_LABELS: Record<StudyStatus, string> = {
  [StudyStatus.ACTIVE]: '모집중',
  [StudyStatus.INACTIVE]: '모집마감',
};

export const getStatusOptions = () => [
  { id: 0, value: 'ALL', label: '상태 전체' },
  ...Object.entries(STATUS_LABELS).map(([value, label], index) => ({
    id: index + 1,
    value,
    label,
  })),
];

export enum SortCriteria {
  NEWEST = 'NEWEST',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
}

export const SORT_OPTIONS = {
  [SortCriteria.NEWEST]: '최신순',
  [SortCriteria.LIKE]: '좋아요순',
  [SortCriteria.COMMENT]: '댓글순',
} as const;

export const getSortOptions = () =>
  Object.entries(SORT_OPTIONS).map(([value, label], index) => ({
    id: index + 1,
    value,
    label,
  }));

export interface SearchStudyParams {
  title?: string;
  category?: StudyCategory | '';
  status?: StudyStatus | '';
  recruitmentPositionTitles?: RecruitmentPositionTitle[];
  lastStudyId?: number;
  sortCriteria?: SortCriteria | '';
  lastSortValue?: number;
}

export interface ApiResponse<T> {
  message: string;
  data: PaginatedResponse<T>;
}

export interface getTagResponseList {
  tagId: number;
  name: string;
}

export interface getRecruitmentPositionResponseList {
  recruitmentPositionId: number;
  title: string;
  headcount: number;
  acceptedCount: number;
}

export interface Study {
  studyId: number;
  title: string;
  content: string;
  category: string;
  likeCount: number;
  commentCount: number;
  status: string;
  viewCount: number;
  studyBookmarkId: number;
  liked: boolean;
  getTagResponses: getTagResponseList[];
  getRecruitmentPositionResponses: getRecruitmentPositionResponseList[];
}

export type StudyResponse = ApiResponse<Study>;

export interface PaginatedResponse<T> {
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  data: T[];
}
