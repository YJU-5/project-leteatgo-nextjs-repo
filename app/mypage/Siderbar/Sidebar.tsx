"use client"
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className={styles.sidebar}>
      <ul>
        <li onClick={() => router.push('/mypage/inquiries')}>1대1 문의</li>
        <li onClick={() => router.push('/mypage/follow-management')}>팔로우 관리</li>
        <li onClick={() => router.push('/mypage/reviews')}>내 후기 조회</li>
        <li onClick={() => router.push('/mypage/event-info')}>내 개최정보</li>
      </ul>
    </div>
  );
}