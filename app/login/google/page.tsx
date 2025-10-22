"use client";

import { login, User } from "@/store/UserSlice";
import { AppDispatch } from "@/store/Store";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { JwtPayload } from "jwt-decode";

interface ExtendedJwtPayload extends JwtPayload {
  name?: string;
  email?: string;
  picture?: string;
  role?: string;
}

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getGoogleToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      if (!accessToken) return;

      try {
        // 환경 변수에서 API URL 가져오기
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        const response = await fetch(`${apiUrl}/user/google/login`, {
          credentials: "include", // 쿠키 포함
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        });

        const userData = await response.json();
        const decodedToken = jwtDecode(userData.token) as ExtendedJwtPayload;
        const userInfo: User = {
          id: decodedToken.sub || "",
          name: decodedToken.name || "",
          email: decodedToken.email || "",
          phoneNumber: null,
          birthday: null,
          gender: null,
          pictureUrl: decodedToken.picture || "",
          description: null,
          role: decodedToken.role || "",
          socialProvider: "google",
          socialId: decodedToken.sub || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deleted: false,
        };
        //redux store로 토큰과 유저정보 보내주기
        dispatch(login({ jwtToken: userData.token, user: userInfo }));

        // localStorage에 사용자 정보 저장
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            id: userInfo.id,
            name: userInfo.name,
          })
        );

        // 로그인 성공 후 메인 페이지로 리다이렉트
        router.push("/");
      } catch (error) {
        console.log("구글 로그인 에러:", error);
        // 에러 발생 시 로그인 페이지로 리다이렉트
        router.push("/login");
      }
    };
    getGoogleToken();
  }, [dispatch, router]);

  return <p>로그인 처리 중…</p>;
}
