"use client";

import styles from "./login.module.css";
import Image from "next/image";

export default function GoogleLogin() {
  const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  const handleGoogleLogin = () => {
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/auth?` +
      `client_id=${GOOGLE_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&response_type=token` +
      `&scope=` +
      `email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read` +
      `&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div>
      {/* 구글로그인 버튼 */}
      <button className={styles.googleButton} onClick={handleGoogleLogin}>
        <Image
          src="/login/google-logo.png"
          alt="Google Logo"
          width={20}
          height={20}
          priority
        />
        Google로 시작하기
      </button>
    </div>
  );
}
