

import KakaoLogin from "@/components/KakaoLogin"
import styles from './login.module.css'
import GoogleLogin from "@/components/GoogleLogin"


export default  function Login(){



  return(
    <div className={styles.page}>
      <KakaoLogin/>
      <GoogleLogin/>
    </div>
  )
}
