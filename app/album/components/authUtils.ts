const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
import { store } from "@/store/Store";
import { updateUser } from "@/store/UserSlice";

// 토큰을 Redux store에서 가져오기 (실패시 localStorage)
export const getToken = () => {
  const state = store.getState();
  const token = state.user.jwtToken;
  if (token) return token;
  
  // Redux store에 없으면 localStorage에서 가져오기
  return localStorage.getItem("jwtToken");
};

// 현재 로그인한 사용자 정보 가져오기 (실패시 localStorage)
export const getCurrentUser = () => {
  const state = store.getState();
  const user = state.user.user;
  if (user) return user;
  
  // Redux store에 없으면 localStorage에서 가져오기
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Failed to parse user info from localStorage:", error);
  }
  return null;
};

// 사용자가 리소스의 소유자인지 확인
export const isOwner = (resourceUserId: string | number) => {
  const userInfo = getCurrentUser();
  console.log("=== isOwner Debug Info ===");
  console.log("Current user full info:", userInfo);
  console.log("Resource user ID:", resourceUserId);

  if (!userInfo || !resourceUserId) {
    console.log("Missing user info or resource ID");
    return false;
  }

  // 현재 사용자의 id만 확인
  const currentUserId = userInfo.id?.toString();
  const resourceId = resourceUserId?.toString();

  console.log("Current user id:", currentUserId);
  console.log("Resource user id:", resourceId);
  console.log("ID match:", currentUserId === resourceId);
  console.log("=== End Debug Info ===");

  // id가 일치하는 경우에만 소유자로 인정
  return currentUserId === resourceId;
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
  // Redux store와 localStorage 모두 초기화
  store.dispatch({ type: 'user/logout' });
  localStorage.clear();
  window.location.reload();
};

// 로그아웃 함수에 추가
const handleLogout = () => {
  localStorage.removeItem("user"); // 기존 코드
  localStorage.clear(); // 추가: 모든 localStorage 데이터 정리
};

// 로그인 성공 후
const handleLoginSuccess = (userData: {
  id: string;
  name: string;
  email: string;
  pictureUrl?: string;
  socialId?: string;
}) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const refreshUserInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      const userData = await response.json();
      // Redux store와 localStorage 모두 업데이트
      store.dispatch(updateUser(userData));
      return userData;
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh user info:", error);
    return null;
  }
};
