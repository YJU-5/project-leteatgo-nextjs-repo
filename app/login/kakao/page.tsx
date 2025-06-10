"use client";

import { login } from "@/store/UserSlice";
import { AppDispatch } from "@/store/Store";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshUserInfo } from "@/app/album/components/authUtils";

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
        //백엔드로 코드 보내주고 jwt토큰 받기
        const userResponse = await fetch(
          "http://localhost:3001/user/kakao/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: data.access_token }),
          }
        );

        const userData = await userResponse.json();
        localStorage.setItem("jwtToken", userData.token);
        await refreshUserInfo(); // 서버에서 내 정보 받아와서 user 저장
        router.push("/");
      } catch (error) {
        console.log("카카오 로그인 에러:", error);
      }
    };

    getKakaoToken();
  }, []);

  return <p></p>;
}
