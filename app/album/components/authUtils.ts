// 토큰을 로컬 스토리지에서 가져오기
export const getToken = () => {
  const token = localStorage.getItem("jwtToken");
  console.log("Current token:", token); // 디버깅용
  return token;
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    console.log("Current user info from localStorage:", userStr);
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    console.log("Parsed user object:", user);

    // Google 이메일 기반으로 프로필 이미지 URL 생성
    if (!user.pictureUrl && user.email) {
      // Google 이메일인 경우
      if (user.email.endsWith("@gmail.com")) {
        user.pictureUrl = `https://lh3.googleusercontent.com/a/default-user=s150`;
      } else {
        user.pictureUrl = "/default-profile.png";
      }
    }
    return user;
  } catch (error) {
    console.error("Failed to parse user info:", error);
    return null;
  }
};

// 사용자가 리소스의 소유자인지 확인
export const isOwner = (resourceUserId: string | number) => {
  const userInfo = getCurrentUser();
  console.log("Checking ownership - Current user:", userInfo);
  console.log("Checking ownership - Resource user ID:", resourceUserId);

  if (!userInfo || !resourceUserId) return false;

  // 현재 사용자의 socialId와 리소스 사용자의 id를 비교
  const currentUserSocialId = userInfo.socialId?.toString();
  const resourceId = resourceUserId?.toString();

  console.log("Current user socialId:", currentUserSocialId);
  console.log("Resource user id:", resourceId);

  return currentUserSocialId === resourceId;
};

// 로그인 상태 확인
export const checkAuth = () => {
  const token = getToken();
  const userInfo = getCurrentUser();

  console.log("Checking auth - Token:", token, "UserInfo:", userInfo); // 디버깅용

  return !!(token && userInfo);
};

// API 요청에 사용할 헤더 생성
export const getAuthHeaders = (isFormData: boolean = false) => {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// 에러 처리
export const handleApiError = async (error: any) => {
  let errorMessage = "알 수 없는 오류가 발생했습니다.";

  if (error.status === 401) {
    errorMessage = "로그인이 필요한 서비스입니다.";
  } else if (error.status === 403) {
    errorMessage = "해당 작업에 대한 권한이 없습니다.";
  } else if (error.status === 404) {
    errorMessage = "요청한 리소스를 찾을 수 없습니다.";
  } else if (error.status === 500) {
    errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  // 서버 응답이 있는 경우 해당 메시지 사용
  if (error.response) {
    try {
      const data = await error.response.json();
      errorMessage = data.message || errorMessage;
    } catch (e) {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
  }

  const err = new Error(errorMessage);
  (err as any).status = error.status;
  throw err;
};

// 로그인 상태 변경 시 호출할 함수
export const handleAuthStateChange = () => {
  // 로컬 스토리지 초기화
  localStorage.clear();

  // 페이지 새로고침
  window.location.reload();
};
