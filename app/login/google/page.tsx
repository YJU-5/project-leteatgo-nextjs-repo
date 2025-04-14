"use client";

import { login } from "@/store/UserSlice";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGoogleToken = async () => {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");

        if (!accessToken) {
          setError("액세스 토큰을 찾을 수 없습니다.");
          return;
        }

        console.log("Access token obtained:", accessToken);

        // 백엔드로 accessToken 보내주기
        const response = await fetch(
          "http://localhost:3001/user/google/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ access_token: accessToken }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `서버 오류: ${response.status}`
          );
        }

        const userData = await response.json();
        console.log("User data received:", userData);

        if (!userData.token) {
          throw new Error("토큰이 없습니다");
        }

        // redux store로 토큰과 유저정보 보내주기
        const userInfo = jwtDecode(userData.token);
        dispatch(login({ jwtToken: userData.token, user: userInfo }));

        router.push("/");
      } catch (error) {
        console.error("구글 로그인 에러:", error);
        setError(error.message || "로그인 중 오류가 발생했습니다");
      }
    };

    getGoogleToken();
  }, [dispatch, router]);

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
