"use client";

import styles from "./page.module.css";
import Link from "next/link";
import ContentSlider from "@/components/ContentSlider/ContentSlider";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Host {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  birthday: string | null;
  gender: string | null;
  pictureUrl: string;
  description: string | null;
  role: string;
  socialProvider: string;
  socialId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface Content {
  id: number; // 아이디
  title: string; // 제목
  description: string; // 설명
  pictureUrl: string; // 이미지
  profileImg: string; // 프로필 이미지
  username: string; // 유저 이름
  name: string; // 이름
  address: string; // 주소
  startDate: string; // 시작일
  // tag?: string[];
  maxParticipants: number; // 최대 참여자 수
  gender: string; // 성별
  minAge: number; // 최소 나이
  maxAge: number; // 최대 나이
  latitude: string; // 위도
  longitude: string; // 경도
  price: number; // 가격
  createdAt: string; // 생성일
  isActive: number; // 활성화 여부
  hostId: Host; // 호스트 아이디
}

export default function Start() {
  const { t } = useLanguage();
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat-room`
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
            {t.start.createRoom}
          </Link>
          <Link href="/start/join" className={styles.joinRoom}>
            {t.start.joinRoom}
          </Link>
        </div>
      </div>
      <hr />
      <div className={styles.underContainer}>
        <h1
          className={`${styles.popularTitle} ${styles.upContent} ${styles.delay1}`}
        >
          {t.start.popularTitle}
        </h1>
        <ContentSlider contents={contents} link={true} />
      </div>
    </div>
  );
}
