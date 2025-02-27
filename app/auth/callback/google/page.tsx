"use client"

import { useRouter } from "next/router"
import { useEffect } from "react";


export default function GoogleCallback(){


  useEffect(()=>{
    const getGoogleToken = async () =>{

      const hashParams = new URLSearchParams(window.location.hash.substring(1)); 
      //URL에서 window.location.hash.substring(1) = #이후로 나오는 부분을 URLSerchParams 객체로 변환해서 가지고오겠다. 그리고 #를 제거하겠다.
      const accessToken = hashParams.get('access_token')
      //가지고온 URL에서 access_token의 값을 가지고 오겠다.
      console.log(accessToken);
      if(!accessToken)return;

      try {
        //백엔드로 accessToken 보내주기
        const response = await fetch("http://localhost:3001/user/google/login",{
          method: "POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({ access_token: accessToken})
        })

        const data = await response.json()
        console.log(data);

        
      } catch (error) {
        console.log("구글 로그인 에러:", error);
      }



    }

    getGoogleToken()
  },[])

  return(
    <div>...로딩중</div>
  )
}