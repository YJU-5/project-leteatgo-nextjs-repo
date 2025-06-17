"use client"
import { usePathname, } from 'next/navigation';
import styles from './Sidebar.module.css';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/mypage/myeventlist", name: "내 개최 조회" },
    { href: "/mypage/myreviewlist", name: "내 후기 조회" },
    { href: "/mypage/inquiry", name: "1:1 문의" },
    { href: "/mypage/followlist", name: "팔로우 관리" },
  ];



  return (
    <div className={styles.sidebar}>
      <ul>
        {
          menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={pathname === item.href ? styles.blue : styles.menuItem}
              >
                {item.name}
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  );
}