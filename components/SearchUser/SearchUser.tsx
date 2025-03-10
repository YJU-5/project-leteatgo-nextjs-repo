"use client";

import React, { useRef } from "react";
import styles from "./SearchUser.module.css";
import { useState } from "react";
import Image from "next/image";

export default function SearchUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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
