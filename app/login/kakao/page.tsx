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

export default function KakaoCallback() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getKakaoToken = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      if (!code) return;

      try {
        // 토큰가지고오기
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "",
            redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "",
            code,
          }),
        });

        const data = await response.json();

        // 환경 변수에서 API URL 가져오기
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        //백엔드로 코드 보내주고 jwt토큰 받기
        const userResponse = await fetch(`${apiUrl}/user/kakao/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: data.access_token }),
        });

        const userData = await userResponse.json();
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
          socialProvider: "kakao",
          socialId: decodedToken.sub || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deleted: false,
        };
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
        console.log("카카오 로그인 에러:", error);
        // 에러 발생 시 로그인 페이지로 리다이렉트
        router.push("/login");
      }
    };

    getKakaoToken();
  }, [dispatch, router]);

  return <p>로그인 처리 중...</p>;
}
