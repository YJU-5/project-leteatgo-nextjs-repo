import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 토큰을 로컬 스토리지에서 가져오기
export const getToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("jwtToken");
  return token;
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return null;
    }

    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error("Failed to parse user info:", error);
    return null;
  }
};

// 로그인 상태 확인
export const checkAuth = () => {
  const token = getToken();
  const userInfo = getCurrentUser();

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

  throw new Error(errorMessage);
};

// 사용자가 리소스의 소유자인지 확인
export const isOwner = (resourceUserId: string | number) => {
  const userInfo = getCurrentUser();

  if (!userInfo || !resourceUserId) {
    return false;
  }

  // JWT 토큰에서 직접 id를 가져오기 (UUID)
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode(token) as any;
      const currentUserId = decoded.id?.toString(); // JWT의 id 필드 (UUID)
      const resourceId = resourceUserId?.toString();

      if (currentUserId && resourceId) {
        return currentUserId === resourceId;
      }
    } catch (error) {
      console.error("JWT 디코딩 실패:", error);
    }
  }

  // 폴백: userInfo.id 사용 (socialId일 수 있음)
  const currentUserId = userInfo.id?.toString();
  const resourceId = resourceUserId?.toString();

  return currentUserId === resourceId;
};
