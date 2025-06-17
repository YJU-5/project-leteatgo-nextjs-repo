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
        const decoded = jwtDecode(token) as any;
        const userInfo: User = {
          id: decoded.socialId,
          name: decoded.name,
          email: decoded.email,
          pictureUrl: decoded.pictureUrl || "/default-profile.png",
          phoneNumber: null,
          birthday: null,
          gender: null,
          description: null,
          role: "USER",
          socialProvider: "GOOGLE",
          socialId: decoded.socialId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deleted: decoded.deleted,
        };
        dispatch(login({ jwtToken: token, user: userInfo }));
      } catch (error) {
        console.error("토큰 디코딩 오류:", error);
      }
    }

    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) return; // Redux 상태 복구 전까지 로딩 UI 표시

  return children;
}
