import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// 유저정보 타입지정
export interface User {
  email: string;
  name: string;
  socialId: number;
  deleted: boolean;
  exp: number;
  iat: number;
}

interface UserState{
  jwtToken: string | null;
  user: User| null;
}


const token = localStorage.getItem('jwtToken') !== null ? localStorage.getItem('jwtToken') : null
const userInfo = token ? jwtDecode<User>(token) : null

// 유저 정보 초기값
const initialState:UserState = {
  jwtToken: token,
  user: userInfo,
}

// Redux 슬라이스 (로그인/로그아웃 기능 정의)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ jwtToken: string; user: any }>) => {
      state.jwtToken = action.payload.jwtToken;
      state.user = action.payload.user;
      localStorage.setItem('jwtToken',state.jwtToken);
    },
    logout: (state) => {
      state.jwtToken = null;
      state.user = null;
      localStorage.removeItem('jwtToken');
    },
  },
});


export const { login, logout} = userSlice.actions;
// 정의한 액션들을 export
export default userSlice.reducer;
// userSlice 를 export