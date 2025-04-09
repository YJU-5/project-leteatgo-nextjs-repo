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

// 유저 정보 와 토큰 초기값
const initialState: UserState = {
  jwtToken: null,
  user: null,
};

// Redux 슬라이스 (로그인/로그아웃 기능 정의)
const userSlice = createSlice({
  name: "user",
  initialState, //유저 정보와 토큰
  reducers: {
    //로그인 기능 initialState에 있는 토큰과 유저정보 저장
    login: (state, action: PayloadAction<{ jwtToken: string; user: User }>) => {
      state.jwtToken = action.payload.jwtToken;
      state.user = action.payload.user;

      localStorage.setItem("jwtToken", state.jwtToken);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    //로그아웃 기능
    logout: (state) => {
      state.jwtToken = null;
      state.user = null;
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;
// 정의한 액션들을 export
export default userSlice.reducer;
// userSlice 를 export
