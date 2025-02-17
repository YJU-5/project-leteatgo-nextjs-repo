import styles from "./login.module.css"

export default function Login(){
  return(
    <div  className={styles.body}>

    
    <div>
      {/* 카카오로그인 버튼 */}
      <div className={styles.container}>
        <div >
          <img src="/KakaoTalk symbol.png" className={styles.symbol} />
        </div>
        <div>
          <span className={styles.label}>Kakao로 시작하기</span>
        </div>
      </div>

      <div className={styles.container}>
        <div >
          <img src="/KakaoTalk symbol.png" className={styles.symbol} />
        </div>
        <div>
          <span className={styles.label}>Kakao로 시작하기</span>
        </div>
      </div>

    </div>
    
      

      
    </div>
  )
}
