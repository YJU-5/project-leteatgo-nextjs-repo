

import KakaoLogin from "@/components/login/KakaoLogin"
import styles from '@/components/login/login.module.css'
import GoogleLogin from "@/components/login/GoogleLogin"


export default  function Login(){



  return(
    <div className={styles.container}>
      <KakaoLogin/>
      <GoogleLogin/>
    </div>
  )
}
