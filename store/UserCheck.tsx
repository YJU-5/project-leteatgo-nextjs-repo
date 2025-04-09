"use client"; // Next.js 환경

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./UserSlice";
import { jwtDecode } from "jwt-decode";
import { User } from "./UserSlice";

export default function UserCheck({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); //  로딩 상태 추가

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      try {
        const userInfo = jwtDecode(token) as User; // 타입 단언 추가
        dispatch(login({ jwtToken: token, user: userInfo })); //  Redux에 저장
      } catch (error) {
        console.error("토큰 디코딩 오류:", error);
      }
    }

    setIsLoading(false); // 로딩 완료
  }, [dispatch]);

  if (isLoading) return; // Redux 상태 복구 전까지 로딩 UI 표시

  return children;
}
