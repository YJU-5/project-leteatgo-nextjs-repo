"use client";

import React, { useRef, useEffect } from "react";
import styles from "./SearchUser.module.css";
import { useState } from "react";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  profileImage: string;
}

export default function SearchUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchedUserList, setSearchedUserList] = useState<User[]>([]);
  const [userList /* setUserList */] = useState<User[]>([
    {
      id: 1,
      name: "차승현",
      profileImage: "/gitb.png",
    },
    {
      id: 2,
      name: "김형선",
      profileImage: "/gitb.png",
    },
    {
      id: 3,
      name: "홍태관",
      profileImage: "/gitb.png",
    },
    {
      id: 4,
      name: "구진모",
      profileImage: "/gitb.png",
    },
    {
      id: 5,
      name: "홍길동",
      profileImage: "/gitb.png",
    },
    {
      id: 6,
      name: "홍길은",
      profileImage: "/gitb.png",
    },
    {
      id: 7,
      name: "홍길금",
      profileImage: "/gitb.png",
    },
    {
      id: 8,
      name: "이순신",
      profileImage: "/gitb.png",
    },
    {
      id: 9,
      name: "김유신",
      profileImage: "/gitb.png",
    },
  ]);

  useEffect(() => {
    const filteredUsers = userList.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchedUserList(filteredUsers);
  }, [searchValue, userList]);

  const handleSearch = () => {
    if (!containerRef.current) return;
    setIsOpen(!isOpen);
    setSearchValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className={styles.searchUser} ref={containerRef}>
      <div className={styles.searchUserContainer}>
        <button className={styles.searchUserButton} onClick={handleSearch}>
          <Image src="/search.png" alt="search" width={24} height={24} />
          <p>유저 검색</p>
        </button>
      </div>
      {isOpen && searchValue && (
        <div className={styles.searchResults}>
          {searchedUserList.length > 0 ? (
            searchedUserList.map((user) => (
              <div key={user.id} className={styles.userItem}>
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  width={40}
                  height={40}
                  className={styles.userProfileImage}
                />
                <p className={styles.userName}>{user.name}</p>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      )}
      <div
        className={styles.searchUserInputContainer}
        style={{ top: isOpen ? "2px" : "100px" }}
      >
        <input
          type="text"
          placeholder="사용자 이름을 입력하세요"
          value={searchValue}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
