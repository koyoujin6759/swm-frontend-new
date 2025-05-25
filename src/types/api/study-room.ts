import { ApiResponse, CursorPageData } from '.';

export enum SortCriteria {
  STAR = 'STAR', // 평점 -> lastAverageRatingValue
  LIKE = 'LIKE', // 좋아요 -> lastSortValue
  REVIEW = 'REVIEW', // 리뷰 -> lastSortValue
  PRICE_ASC = 'PRICE_ASC', // 가격오름차순 -> lastSortValue
  PRICE_DESC = 'PRICE_DESC', // 가격내림차순 -> lastSortValue
}

export type StudyRoomOption =
  | 'WIFI'
  | 'ELECTRICAL'
  | 'CHAIR_DESK'
  | 'MART'
  | 'PRINTING'
  | 'FULL_MIRROR'
  | 'FOODS'
  | 'INTERNAL_TOILET'
  | 'NO_SMOKE'
  | 'PARKING'
  | 'PC_NOTEBOOK'
  | 'TV_BEAM_PROJECT'
  | 'WATER'
  | 'WHITEBOARD'
  | 'ALCOHOL'
  | 'SCREEN'
  | 'MIKE';

export interface StudyRoomListParams {
  title?: string; // 검색어
  locality?: string;
  headCount?: number; // 인원 수:50명까지 제한 / condition --> entireMaxHeadcount >= headCount => return item
  minPricePerHour?: number; // 최소 시간당 가격: 최소 >= DB에 저장된 값 <= 최대
  maxPricePerHour?: number; // 최대 시간당 가격
  options?: StudyRoomOption[]; // 옵션들
  sortCriteria?: SortCriteria; // 정렬 기준
  userLatitude?: number; // 유저 위도
  userLongitude?: number; // 유저 경도
  lastStudyRoomId?: number; // 마지막 스터디룸 ID (커서)
  lastSortValue?: number; // 마지막 정렬 값 (커서): LIKE, REVIEW, PRICE_ASC, PRICE_DESC
  lastLatitudeValue?: number; // 마지막 위도 값 (커서)
  lastLongitudeValue?: number; // 마지막 경도 값 (커서)
  lastAverageRatingValue?: number; // 마지막 평점 값 (커서)
}

export interface StudyRoomListRes {
  studyRoomId: number;
  title: string;
  thumbnail: string;
  locality: string;
  address: string;
  phoneNumber: string;
  likeCount: number;
  reviewCount: number;
  entireMinPricePerHour: number;
  entireMaxPricePerHour: number;
  entireMaxHeadcount: number;
  starAvg: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  studyBookmarkId: number;
  tags: TagRes[];
}

export interface CreateStudyRoomReq {
  title: string;
  subtitle?: string;
  introduce: string;
  notice: string;
  guideline: string;
  openingTime: string;
  closingTime: string;
  address: {
    address: string;
    detailAddress: string;
    region: string;
    locality: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  thumbnail: string;
  referenceUrl?: string;
  phoneNumber: string;
  tags?: string[];
  dayOffs?: string[];
  imageUrls: string[];
  types: string[];
  options: string[];
  reservationTypes: [
    {
      maxHeadcount: number;
      reservationOption: string;
      pricePerHour: number;
    },
  ];
  minReserveTime: number;
  entireMinHeadcount: number;
  entireMaxHeadcount: number;
  entireMinPricePerHour: number;
  entireMaxPricePerHour: number;
}

export interface TagRes {
  studyRoomTagId: number;
  tag: string;
}

export type StudyRoomListResponse = ApiResponse<
  CursorPageData<StudyRoomListRes>
>;

export type CreateStudyRoomResponse = ApiResponse<
  CursorPageData<StudyRoomListRes>
>;

export interface LikeResponse {
  message: string;
  data: {
    studyRoomLikeId: number;
    studyRoomLikeCount: number; //1번만 가능
  };
}

export interface UnlikeResponse {
  message: string;
  data: object;
}
