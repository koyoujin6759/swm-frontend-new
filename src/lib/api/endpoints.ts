export const API_ENDPOINTS = {
  STUDY_ROOM: {
    LIST: '/api/v1/studyroom',
    DETAIL: '/api/v1/studyroom/:studyRoomId',
    CREATE: '/api/v1/studyroom',
    LIKE: '/api/v1/studyroom/:studyRoomId/like',
    UNLIKE: '/api/v1/studyroom/like/:studyRoomId',
  },
  EXTERNAL_STUDY: {
    LIST: '/api/v1/external/studies',
  },
  STUDY: {
    LIST: '/api/v1/study',
    CREATE: '/api/v1/study',
    DETAIL: (studyId: string) => `/api/v1/study/${studyId}`,
    DELETE: (studyId: string) => `/api/v1/study/${studyId}`,
    PATCH: (studyId: string) => `/api/v1/study/${studyId}`, //스터디수정
    COMMENT: (studyId: string) => `/api/v1/study/${studyId}/comment`, //댓글생성,조회
    DELETE_COMMENT: (studyId: string, commentId: string) =>
      `/api/v1/study/${studyId}/comment/${commentId}`, //댓글삭제
    PATCH_COMMENT: (commentId: string) => `/api/v1/study/comment/${commentId}`, //댓글수정
    REPLY: (parentId: string) => `/api/v1/comment/${parentId}/reply`, //답글조회
    CREATE_REPLY: (studyId: string, parentId: string) =>
      `/api/v1/study/${studyId}/comment/${parentId}`, //답글생성
    EDIT_POSITION: (studyId: string) =>
      `/api/v1/study/${studyId}/recruitment-position`, //스터디모집 포지션수정 (추가,삭제,변경)
    BOOKMARK: (studyId: string) => `/api/v1/study/${studyId}/bookmark`, //스터디 북마크 추가
    DELETE_BOOKMARK: (bookmarkId: string) =>
      `/api/v1/study/bookmark/${bookmarkId}`, //스터디 북마크 취소
    LIKE: (studyId: string) => `/api/v1/study/${studyId}/like`, //스터디 좋아요 추가삭제
    STATUS: (studyId: string) => `/api/v1/study/${studyId}/status`, //스터디 모집 상태수정
    APPLY: (recruitmentPositionId: string) => `/api/v1/recruitment-position/${recruitmentPositionId}/participation`, //스터디 모집 참여 신청, 참여조회
    APPLY_DETAIL: (participationId: string) => `/api/v1/recruitment-position/participation/${participationId}`, //스터디 참여신청 상세조회
    APPLY_POSITION_CHANGE: (recruitmentPositionId: string, participationId: string) => `/api/v1/recruitment-position/${recruitmentPositionId}/participation/${participationId}/position`, //스터디 참여신청 포지션 변경
    APPLY_STATUS_CHANGE: (participationId: string) => `/api/v1/recruitment-position/participation/${participationId}/status`, //스터디 참여상태 수정
  },
  FILES: {
    PRESIGNED_URL: '/api/v1/files/presigned-url',
  },
  USER: {
    INFO: '/api/v1/user',
    CREATE: '/api/v1/user',
    CHECK_NICKNAME: '/api/v1/user/nickname/validation',
    CHECK_EMAIL: '/api/v1/user/login-id/validation',
    SEND_AUTH_CODE: '/api/v1/user/login-id/auth-codes',
    CHECK_AUTH_CODE: '/api/v1/user/login-id/auth-codes/verification',
    FIND_ID: '/api/v1/user/login-id/retrieval',
    SEND_PASSWORD_AUTH_CODE: '/api/v1/user/password/auth-codes',
    CHECK_PASSWORD_AUTH_CODE: '/api/v1/user/password/auth-codes/verification',
    RESET_PASSWORD: '/api/v1/user/password',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
} as const;
