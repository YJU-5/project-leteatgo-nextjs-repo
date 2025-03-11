"use client"
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { name: '1:1 문의', path: '/mypage/inquiries' },
    { name: '팔로우 관리', path: '/mypage/follow' },
    { name: '내 후기 조회', path: '/mypage/reviews' },
    { name: '내 개최정보', path: '/mypage/event-info' },
  ];

  return (
    <div className={styles.sidebar}>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => router.push(item.path)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}