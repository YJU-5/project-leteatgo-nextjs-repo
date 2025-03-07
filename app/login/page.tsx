import KakaoLogin from "@/components/login/KakaoLogin"
import GoogleLogin from "@/components/login/GoogleLogin"
import styles from "./page.module.css";

export default function Login() {
  return (
    <div className={styles.login}>
      <h1 className={styles.loginTitle}>로그인</h1>
      <div className={styles.loginButton}>
        <KakaoLogin/>
        <GoogleLogin/>
      </div>
    </div>
  );
}
