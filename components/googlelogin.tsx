"use client"


import styles from "../app/login/login.module.css"


export default  function GoogleLogin(){

  const GOOGLE_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;



  const handleGoogleLogin = () => {
    const googleAuthUrl = 'https:account.google.com/o/oauth2/v2/auth?client_id='+GOOGLE_ID+'&redirect_uri='+REDIRECT_URI+'&response_type=code'+'&scope=email profile'

  
    window.location.href = googleAuthUrl;
  };


  return(
    <div>
            {/* 구글로그인 버튼 */}
        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          <img src="/google-logo.png" alt="Google Logo" width={20} height={20} />
          Google로 시작하기
        </button>  
    </div>
  )
}

// `https://accounts.google.com/o/oauth2/auth?
//       client_id=${GOOGLE_ID}
//       &redirect_uri=${REDIRECT_URI}
//       &response_type=token
//       &scope=email profile`;