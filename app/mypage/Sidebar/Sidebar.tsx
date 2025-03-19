"use client"
import { usePathname, } from 'next/navigation';
import styles from './Sidebar.module.css';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();



  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <Link href="/mypage/event-info"
            className={pathname == "/mypage/event-info" ? styles.blue : styles.menuItem}
          >
            내 개최 조회
          </Link>
        </li>
        <li>
          <Link href="/mypage/myreviews" className={pathname == "/mypage/myreviews" ? styles.blue : styles.menuItem}>
            내 후기 조회
          </Link>
        </li>
        <li>
          <Link href="/mypage/inquiry" className={pathname == "/mypage/inquiry" ? styles.blue : styles.menuItem}>
            1:1 문의
          </Link>
        </li>
        <li>
          <Link href="/mypage/followlist" className={pathname == "/mypage/followlist" ? styles.blue : styles.menuItem}>
            팔로우 관리
          </Link>
        </li>
      </ul>
    </div>
  );
}