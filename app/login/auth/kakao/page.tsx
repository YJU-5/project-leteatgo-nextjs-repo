"use client"

import { useSearchParams } from "next/navigation"
import {useEffect,useState} from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

export default function KakaoAuth(){
  const router = useRouter();

  useEffect(()=>{
    const getKakaoToken = async () =>{

      const code = new URL(window.location.href).searchParams.get("code");
      if(!code) return;

      try {
        // 토큰가지고오기
        const response = await fetch("https://kauth.kakao.com/oauth/token",{
          method: "POST",
          headers:{
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
            code,
          }),
        });

        const data = await response.json();
        console.log(data);
        console.log("카카오 액서스 토큰:", data.access_token);

        // // 가지고온 토큰으로 유저정보 조회
        // const userResponse = await fetch("https://kapi.kakao.com/v2/user/me",{
        //   headers:{ Authorization: `Bearer ${data.access_token}`},
        // });

        const userResponse = await fetch("http://localhost:3001/user/kakao/login",{
          method: "POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringfy({ access_token: data.access_token})
        })

        const userData = await userResponse.json();
        console.log("카카오 사용자 정보", userData);
        Cookies.set("user",JSON.stringify(userData),{
          expires:7,
          secure:true,
          sameSite: "strict",
        })

        router.push('/')

      } catch (error) {
        console.log("카카오 로그인 에러:", error);
      }
    };

    getKakaoToken();
  },[])


  return(
    <p>로그인중 ...</p>
  )
}


