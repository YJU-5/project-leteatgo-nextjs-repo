"use client"
import { RootState } from "@/store/Store";
import { logout } from "@/store/UserSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NavLogin.module.css"
import { useRouter } from "next/navigation";

export default function NavLogin(){
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state:RootState)=> state.user.jwtToken);

  const handleLogout=()=>{
    dispatch(logout());
    router.push('/');
  }

  return(
    <ul className={styles.navLogin}>
      {
        token ? (
          <><li>
            <img src="/login/notification.png" />
          </li>
          <li>
            <Link href="/mypage">마이 페이지</Link>
          </li>
          <li>
          <span onClick={handleLogout}  style={{ cursor: 'pointer' }}>로그아웃</span>
          </li>
          </>
        ):(
          <li>
          <Link href="/login">소셜 로그인</Link>
          </li>
        )
      }
    </ul>
  )
}