export const getDefaultErrorMessage = (status?: number) => {
  switch (status) {
    case 0:
      return "네트워크 연결을 확인해주세요.";
    case 401:
      return "401: 로그인이 필요한 서비스입니다.";
    case 403:
      return "403: 접근 권한이 없습니다.";
    case 404:
      return "404: 요청하신 페이지를 찾을 수 없습니다.";
    case 500:
      return "500: 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    default:
      return "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
};
