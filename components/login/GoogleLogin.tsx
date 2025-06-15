"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

export default function GoogleLogin() {
  const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleGoogleCallback(code);
    }
  }, [searchParams]);

  const handleGoogleCallback = async (code: string) => {
    try {
      // 코드를 청크로 나누어 전송
      const chunkSize = 500; // 더 작은 청크 사이즈
      const codeChunks = [];
      for (let i = 0; i < code.length; i += chunkSize) {
        codeChunks.push(code.slice(i, i + chunkSize));
      }

      // 각 청크를 순차적으로 전송
      for (let i = 0; i < codeChunks.length; i++) {
        const response = await fetch(
          "http://localhost:3001/auth/google/token/chunk",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chunk: codeChunks[i],
              index: i,
              total: codeChunks.length,
              isLast: i === codeChunks.length - 1,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to process code chunk");
        }

        const data = await response.json();

        // 마지막 청크의 응답에서 토큰을 받음
        if (i === codeChunks.length - 1 && data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          router.push("/");
          return;
        }
      }

      throw new Error("Failed to receive access token");
    } catch (error) {
      console.error("Login error:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/auth?` +
      `client_id=${GOOGLE_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&response_type=code` +
      `&scope=email profile` +
      `&access_type=offline`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div>
      {/* 구글로그인 버튼 */}
      <button className={styles.googleButton} onClick={handleGoogleLogin}>
        <img
          src="/login/google-logo.png"
          alt="Google Logo"
          width={20}
          height={20}
        />
        Google로 시작하기
      </button>
    </div>
  );
}
