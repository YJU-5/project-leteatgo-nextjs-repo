"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles  from "./modal.module.css"

export default function LoginGuard({children}:{children:React.ReactNode}){
  const router = useRouter();
  const jwtToken = localStorage.getItem("jwtToken")
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    if(!jwtToken){
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