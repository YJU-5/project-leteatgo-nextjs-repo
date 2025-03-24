"use client"
import { RootState } from "@/store/Store";
import { logout } from "@/store/UserSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NavLogin.module.css"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Notification from "@/components/Notification/Notification";
import UserMenu from "@/components/UserMenu/UserMenu";

export default function NavLogin(){
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state:RootState)=> state.user.jwtToken);
  const user = useSelector((state:RootState)=> state.user.user);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown,setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleLogout=()=>{
    setShowModal(true)
    setShowDropdown(false);
  }

  const CheckLogout=()=>{
    dispatch(logout());
    router.push('/');
    setShowModal(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);



  return(
    <>
    <ul className={styles.navLogin}>
      {
        token ? (
          <><li>
            <img src="/login/notification.png"
            onClick={() => setShowNotifications(!showNotifications)}
             />
          </li>
          <li>
            <p onClick={()=>setShowDropdown(!showDropdown)}>{user?.name}님</p>
          </li>
          <li>
          <p onClick={handleLogout} >로그아웃</p>
          </li>
          </>
        ):(
          <li>
          <Link href="/login">소셜 로그인</Link>
          </li>
        )
      }
    </ul>
    {
      showModal &&(
        <div className={styles.modalContainer} >
          <div className={styles.modalContent} ref={modalRef}>
            <h3>로그아웃 하시겠습니까.</h3>
            <button onClick={CheckLogout}>yes</button>
            <button onClick={()=>setShowModal(false)}>no</button>
          </div>
      </div>
      )
    }

    {/* 마이페이지이동 창 */}
    <UserMenu
      showDropdown={showDropdown}
      setShowDropdown={setShowDropdown}
      handleLogout={handleLogout}
    />

    {/* 알림창 */}
    <Notification
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
    />
    </>
  )
}

