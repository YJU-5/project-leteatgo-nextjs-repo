import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 유저정보 타입지정
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  birthday: string | null;
  gender: string | null;
  pictureUrl: string;
  description: string | null;
  role: string;
  socialProvider: string;
  socialId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

//유저 정보와 토큰 타입 지정
interface UserState {
  jwtToken: string | null;
  user: User | null;
}

// localStorage에서 초기 상태 복원
const getInitialState = (): UserState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("jwtToken");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        return {
          jwtToken: token,
          user: JSON.parse(userStr)
        };
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
      }
    }
  }
  return {
    jwtToken: null,
    user: null
  };
};

// Redux 슬라이스 (로그인/로그아웃 기능 정의)
const userSlice = createSlice({
  name: "user",
  initialState: getInitialState(),
  reducers: {
    //로그인 기능 initialState에 있는 토큰과 유저정보 저장
    login: (state, action: PayloadAction<{ jwtToken: string; user: User }>) => {
      state.jwtToken = action.payload.jwtToken;
      state.user = action.payload.user;
      // localStorage에도 저장
      localStorage.setItem("jwtToken", action.payload.jwtToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    //로그아웃 기능
    logout: (state) => {
      state.jwtToken = null;
      state.user = null;
      // localStorage에서도 제거
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
    },
    // 사용자 정보 업데이트
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // localStorage도 업데이트
      localStorage.setItem("user", JSON.stringify(action.payload));
    }
  },
});

export const { login, logout, updateUser } = userSlice.actions;
// 정의한 액션들을 export
export default userSlice.reducer;
// userSlice 를 export
