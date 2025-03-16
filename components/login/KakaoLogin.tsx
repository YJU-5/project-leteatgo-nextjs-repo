"use client"

import styles from "./login.module.css"

export default function KakaoLogin() {

  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID; //카카오에서 발급한 클라이언트ID
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI; // 로그인후 이동할 페이지

  const handlekakaoLogin = () => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`
    // kakaoAuthURL : 카카오 로그인페이지 주소
    window.location.href = kakaoAuthURL
    // window.location.href   kakaoauthURL의 URL을 출력합니다.
  }

  return (
    <div>
      {/* 카카오로그인 버튼 */}
      <button className={styles.kakaoButton} onClick={handlekakaoLogin}>
        <svg width="24px" height="24px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={styles.kakaoIcon}>
          <rect width="20" height="20" rx="10" fill="#FEE500" />
          <path d="M10 4C6 4 3 6.5 3 10c0 2 1.4 4 3.5 5.2L6 18.5c-.1.2.1.4.3.3l3.5-2.8c.1 0 .2 0 .3 0 4 0 7-2.7 7-6s-3-6-7-6z" fill="black" />
        </svg>
        <span>Kakao로 시작하기</span>
      </button>
    </div>
  )
}