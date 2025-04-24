import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  email: string;
  name: string;
  socialId: number;
  deleted: boolean;
  exp: number;
  iat: number;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // 기존 user 데이터에 새로운 정보 병합
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
