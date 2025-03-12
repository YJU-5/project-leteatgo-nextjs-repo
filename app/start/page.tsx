"use client";

import styles from "./page.module.css";
import Link from "next/link";
import ContentSlider from "@/components/ContentSlider/ContentSlider";

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
  const contents: Content[] = [
    {
      id: 1,
      img: "/foods/cn-food.jpg",
      profileImg: "/gitb.png",
      username: "차승현",
      name: "차승현의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 2,
      img: "/foods/jp-food.jpg",
      profileImg: "/gitb.png",
      username: "홍태관",
      name: "홍태관의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 3,
      img: "/foods/kr-food.jpg",
      profileImg: "/gitb.png",
      username: "김형선",
      name: "김형선의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 4,
      img: "/foods/us-food.jpg",
      profileImg: "/gitb.png",
      username: "차승현",
      name: "차승현의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
  ];

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
        <ContentSlider contents={contents} />
      </div>
    </div>
  );
}
