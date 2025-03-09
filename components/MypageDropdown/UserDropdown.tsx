"use Client"
import { useEffect, useRef } from 'react';
import styles from './UserDropdown.module.css'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { useRouter } from 'next/navigation';


interface UserDropdownProps {
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
  handleLogout: () => void;
}


export default function UserDropdown({
  showDropdown,
  setShowDropdown,
  handleLogout,
}:UserDropdownProps){
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state:RootState)=> state.user.user);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, setShowDropdown]);


  return(
    showDropdown &&(
      <div className={styles.dropdownMenu} ref={dropdownRef}>
        <div className={styles.profileSection}>
            <img src="/gitb.png" alt="User Avatar" className={styles.userAvatar}/>
            <p className={styles.userName}>{user?.name}</p>
        </div>
        <div className={styles.underLine}></div>
        <div className={styles.buttonGroup}>
          <button className={styles.menuButton} onClick={()=>router.push('./mypage')}>마이페이지</button>
          <button className={styles.menuButton} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>
      )
  )
}