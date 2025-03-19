"use client"
import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

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
  const [name, setName] = useState('')

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.searchTitle}>팔로우 관리</h1>
          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="이름"
                className={styles.searchInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button className={styles.searchButton}>
              <Image
                src="/FollowList/search.png" 
                alt="Search"
                width={16}
                height={16}
                className={styles.searchIcon}
              />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.underLine}></div>
        <div className={styles.itemsContainer}>
          {follows.map((follow, index) => (
            <div key={index} className={styles.followItem}>
              <div className={styles.img}>
                <Image
                 width={78}
                 height={78}
                 src="/gitb.png"
                 alt="유저프로필사진"/>
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