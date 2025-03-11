// components/FollowList.tsx
import styles from './FollowList.module.css';

interface Follow {
  name: string;
  date: string;
}

export default function FollowList() {
  const follows: Follow[] = [
    { name: '구진모', date: '2024.11.30 부터 팔로우 중 '},
    { name: '차승현', date: '2024.11.28 부터 팔로우 중 '},
  ];

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
          <h1 className={styles.searchTitle}>팔로우 관리</h1>
          <div className={styles.search}>  
            <span>이름</span>
            <div className={styles.searchBar}>
              <input
                type="text"
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <img src="/FollowList/search.png" alt="search" className={styles.searchIcon} />
              </button>
            </div>
          </div>
        </div>
      <div className={styles.underLine}></div>
      {follows.map((follow, index) => (
        <div key={index} className={styles.followItem}>
          <div className={styles.img}>
            <img src="/gitb.png" className={styles.followImg}/>
          </div>
          <div className={styles.info}>
            <span>{follow.name}</span>
            <p>{follow.date}</p>
          </div>
          <button className={styles.newBadge}>취소</button>
        </div>
      ))}
    </div>
  );
}