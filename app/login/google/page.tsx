"use client";

import { login } from "@/store/UserSlice";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const getGoogleToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      if (!accessToken) return;

      try {
        const response = await fetch(
          "http://localhost:3001/user/google/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: accessToken }),
          }
        );

        const userData = await response.json();
        const userInfo = jwtDecode(userData.token);
        dispatch(login({ jwtToken: userData.token, user: userInfo }));
        router.push("/");
      } catch (error) {
        console.log("구글 로그인 에러:", error);
      }
    };
    getGoogleToken();
  }, []);

  return <p></p>;
}
