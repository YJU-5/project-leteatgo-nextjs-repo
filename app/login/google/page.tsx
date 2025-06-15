"use client";

import { login } from "@/store/UserSlice";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // URL 쿼리 파라미터에서 code 가져오기
        const code = searchParams.get("code");

        if (!code) {
          const errorMsg = searchParams.get("error");
          setError(errorMsg || "인증 코드를 찾을 수 없습니다.");
          return;
        }

        console.log("Authorization code received");

        // 백엔드로 인증 코드 전송
        const response = await fetch(
          "http://localhost:3005/auth/google/callback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Server error response:", errorData);
          throw new Error(`로그인 실패: ${response.status}`);
        }

        const userData = await response.json();
        console.log("Login successful");

        if (!userData.accessToken) {
          throw new Error("토큰이 없습니다");
        }

        // redux store로 토큰과 유저정보 보내주기
        const userInfo = jwtDecode(userData.accessToken);
        dispatch(login({ jwtToken: userData.accessToken, user: userInfo }));
        router.push("/");
      } catch (error) {
        console.error("구글 로그인 에러:", error);
        setError(error.message || "로그인 중 오류가 발생했습니다");
      }
    };

    if (searchParams.get("code") || searchParams.get("error")) {
      handleGoogleCallback();
    }
  }, [dispatch, router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">로그인 오류</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">로그인 처리 중...</p>
    </div>
  );
}
