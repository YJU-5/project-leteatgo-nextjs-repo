import GoogleLogin from "./components/googlelogin"
import KakaoLogin from "./components/kakaologin"
import styles from "./login.module.css"

export default function Login(){
  return(
    <div className={styles.page}>
      <KakaoLogin/>
      <GoogleLogin/>
    </div>
  )
}
