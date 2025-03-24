"use Client"
import { useEffect, useRef } from 'react';
import styles from './UserMenu.module.css'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface UserDropdownProps {
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
  handleLogout: () => void;
}


export default function UserDropdown({
  showDropdown,
  setShowDropdown,
  handleLogout,
}: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user.user);
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

  const handleMypage = () => {
    setShowDropdown(false)
    router.push('/mypage/followlist')
  }


  return (
    showDropdown && (
      <div className={styles.dropdownMenu} ref={dropdownRef}>
        <div className={styles.profileSection}>
          <Image
            width={80}
            height={80}
            src="/gitb.png"
            alt="프로필"
            className={styles.userImage}
          />
          <p className={styles.userName}>{user?.name}</p>
        </div>
        <div className={styles.underLine}></div>
        <div className={styles.buttonGroup}>
          <button className={styles.menuButton} onClick={handleMypage}>마이페이지</button>
          <button className={styles.menuButton} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>
    )
  )
}