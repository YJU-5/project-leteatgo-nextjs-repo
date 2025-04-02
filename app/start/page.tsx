"use client";

import styles from "./page.module.css";
import Link from "next/link";
import ContentSlider from "@/components/ContentSlider/ContentSlider";
import { useState, useEffect } from "react";

interface Content {
  id: number;
  img: string;
  profileImg: string;
  username: string;
  name: string;
  address: string;
  date: string;
  tag: string[];
  person: number;
}

export default function Start() {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/contents`
        );
        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error("소셜다이닝 데이터를 가져오는데 실패했습니다.", error);
      }
    };

    fetchContents();
  }, []);

  return (
    <div className={styles.start}>
      <div className={styles.topContainer}>
        <div className={`${styles.buttonGroup} ${styles.upContent}`}>
          <Link href="/start/create" className={styles.createRoom}>
            개최하기
          </Link>
          <Link href="/start/join" className={styles.joinRoom}>
            참가하기
          </Link>
        </div>
      </div>
      <hr />
      <div className={styles.underContainer}>
        <h1
          className={`${styles.popularTitle} ${styles.upContent} ${styles.delay1}`}
        >
          현재 인기 소셜 다이닝
        </h1>
        <ContentSlider contents={contents} link={true} />
      </div>
    </div>
  );
}
