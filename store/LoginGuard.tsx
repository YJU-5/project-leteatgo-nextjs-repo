"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginGuard({children}:{children:React.ReactNode}){
  const router = useRouter();
  const jwtToken = localStorage.getItem("jwtToken")
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    if(!jwtToken){
      setShowModal(true)
      router.replace('./login')
    }

  },[router,jwtToken])

  

  return children
}