import KakaoLogin from "@/components/login/KakaoLogin";
import styles from "./page.module.css";
import GoogleLogin from "@/components/login/GoogleLogin";

export default function Login() {
  return (
    <div className={styles.login}>
      <div className={styles.logincontainer}>
        <h1 className={styles.loginTitle}>로그인</h1>
        <div className={styles.loginButton}>
          <KakaoLogin />
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
}
