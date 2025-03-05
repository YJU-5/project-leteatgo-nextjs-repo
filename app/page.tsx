"use client"
import Logoutbutton from "@/components/LogoutButton";
import { RootState } from "@/store/Store";
import Link from "next/link";
import { useSelector } from "react-redux";


export default function Home() {

  const user = useSelector((state:RootState)=> state.user.user);
  const token = useSelector((state:RootState)=> state.user.jwtToken);

  return (
    <div>
      <div>{user?.name}</div>
      <div>{user?.email}</div>
      <div>{user?.socialId}</div>
      <div>{user?.exp}</div>
      <div>{user?.iat}</div>
      {
        user ? <Logoutbutton/>:<Link href={"/login"}>login</Link>
      }
      <div>
      <Link href={"/ex"}>예시 바로가기</Link>
      </div>
    </div>
  );
}
