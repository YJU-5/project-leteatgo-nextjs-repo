"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles  from "./modal.module.css"

export default function LoginGuard({children}:{children:React.ReactNode}){
  const router = useRouter();
  const jwtToken = localStorage.getItem("jwtToken"); //localStorage 에서 jwtToken 가지고오기
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    if(!jwtToken){ //토큰이 없으면 모달창 열기
      setShowModal(true)
    }

  },[jwtToken,router])

  return (
  <>
    {
      showModal?(
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <h3>로그인 후 이용해주세요.</h3>
          <button onClick={()=> router.replace('./login')}>확인</button>
        </div>
      </div>
      ):(
        null
      )
    }
  {children}
  </>
  )
}