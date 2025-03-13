"use client"
import { useState } from 'react';
import styles from './FollowList.module.css';

interface Follow {
  name: string;
  date: string;
}

export default function FollowList() {
  const follows = [
    { name: '구진모', date: '2024.11.30 부터 팔로우 중' },
    { name: '차승현', date: '2024.11.28 부터 팔로우 중' },
    { name: '김형선', date: '2024.11.27 부터 팔로우 중' },
    { name: '홍태관', date: '2024.11.26 부터 팔로우 중' },
  ];
  const [name,setName] = useState('')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.searchTitle}>팔로우 관리</h1>
        <div className={styles.searchContainer}>
          <span>이름</span>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="이름"
              className={styles.searchInput}
              onChange={(e)=>setName(e.target.value)}
            />
            <button className={styles.searchButton}>
              <img src="/FollowList/search.png" alt="search" className={styles.searchIcon} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.underLine}></div>
      <div className={styles.itemsContainer}>
        {follows.map((follow, index) => (
          <div key={index} className={styles.followItem}>
            <div className={styles.img}>
              <img src="/gitb.png" alt="icon" className={styles.followImg} />
            </div>
            <div className={styles.info}>
              <span className={styles.followName}>{follow.name}</span>
              <p className={styles.followDate}>{follow.date}</p>
            </div>
            <button className={styles.cancelbutton}>취소</button>
          </div>
        ))}
      </div>
    </div>
  );
}