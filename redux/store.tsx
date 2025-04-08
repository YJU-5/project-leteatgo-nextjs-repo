import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./auth/authSlice";
import { combineReducers } from "@reduxjs/toolkit";
import sessionStorageMiddleware from "./sessionStorageMiddleware";
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("auth");
    if (serializedState === null || serializedState === undefined) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error(
      "로컬스토리지에서 상태를 불러오는 중 오류가 발생했습니다.",
      err
    );
    return undefined;
  }
};

const preloadedState = loadState();

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionStorageMiddleware),
  preloadedState: preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
