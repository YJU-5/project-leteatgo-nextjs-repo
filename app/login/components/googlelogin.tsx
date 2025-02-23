"use client"
import styles from "../login.module.css"


export default function GoogleLogin(){

  return(
    <div>
        {/* 구글로그인 버튼 */}
      <button className={styles.googleButton}>
        <img src="/google-logo.png" alt="Google Logo" width={20} height={20} />
        Google로 시작하기
      </button>

    </div>
  )
}