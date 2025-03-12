"use client"
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [ 
    { name: '내 개최 조회', path: '/mypage/event-info' },
    { name: '내 후기 조회', path: '/mypage/myreviews' },
    { name: '1:1 문의', path: '/mypage/inquiries' },
    { name: '팔로우 관리', path: '/mypage/follow' },
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