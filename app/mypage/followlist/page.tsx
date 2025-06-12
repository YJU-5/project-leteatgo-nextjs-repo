"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

interface Follow {
  id: string;
  name: string;
  profileImage: string;
  followedAt: string;
}

export default function FollowList() {
  const [follows, setFollows] = useState<Follow[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    async function getFollowings() {
      const res = await fetch("http://localhost:3001/subscription", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (!res.ok) throw new Error("정보를가지고오지못했습니다.");
      const data = await res.json();
      setFollows(data);
    }
    getFollowings();
  }, []);

  const filteredData = name
    ? follows.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
    : follows;

  const Unfollow = async(userId: string) => {
    const res = await fetch(`http://localhost:3001/subscription/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    if (res.ok) {
      // 성공적으로 삭제된 경우, 리스트에서 해당 유저를 제거
      setFollows(prev => prev.filter(user => user.id !== userId));
    } else {
      alert("언팔로우에 실패했습니다.");
    }
  }

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
        {filteredData.length > 0 ? (
          filteredData.map((follow, index) => (
            <div key={index} className={styles.followItem}>
              <div className={styles.img}>
                <Image
                  width={78}
                  height={78}
                  src={follow.profileImage || "/gitb.png"}
                  alt="유저프로필사진"
                />
              </div>
              <div className={styles.usercontainer}>
                <p className={styles.userName}>{follow.name}</p>
                <p className={styles.followDate}>{follow.followedAt} 부터 팔로우 중</p>
              </div>
              <button className={styles.cancelbutton} onClick={() => Unfollow(follow.id)}>취소</button>
            </div>
          ))
        ) : (
          <div>검색된 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
}