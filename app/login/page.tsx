

import KakaoLogin from "@/components/kakaologin"
import styles from './login.module.css'
import GoogleLogin from "@/components/googlelogin"


export default  function Login(){



  return(
    <div className={styles.page}>
      <KakaoLogin/>
      <GoogleLogin/>
    </div>
  )
}
