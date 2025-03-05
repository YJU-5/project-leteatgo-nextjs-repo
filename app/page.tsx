"use client";


import Image from "next/image";
import styles from "./page.module.css";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import ContentSlider from "@/components/ContentSlider/ContentSlider";

interface Review {
  id: number;
  img: string;
  name: string;
  comment: string;
}

interface Content {
  id: number;
  img: string;
  name: string;
  address: string;
  date: string;
  tag: string[];
  person: number;
}

export default function Home() {
  const reviews: Review[] = [
    {
      id: 1,
      img: "/foods/cn-food.jpg",
      name: "차승현",
      comment: "소셜다이닝 좋아요",
    },
    {
      id: 2,
      img: "/foods/jp-food.jpg",
      name: "홍태관",
      comment: "소셜다이닝 좋아요",
    },
    {
      id: 3,
      img: "/foods/kr-food.jpg",
      name: "김형선",
      comment: "소셜다이닝 좋아요",
    },
    {
      id: 4,
      img: "/foods/us-food.jpg",
      name: "차승현",
      comment: "소셜다이닝 좋아요",
    },
    {
      id: 5,
      img: "/foods/cn-food.jpg",
      name: "구진모",
      comment: "소셜다이닝 좋아요",
    },
    {
      id: 6,
      img: "/foods/kr-food.jpg",
      name: "홍태관",
      comment: "소셜다이닝 좋아요",
    },
  ];

  const contents: Content[] = [
    {
      id: 1,
      img: "/foods/cn-food.jpg",
      name: "차승현의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 2,
      img: "/foods/jp-food.jpg",
      name: "홍태관의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 3,
      img: "/foods/kr-food.jpg",
      name: "김형선의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 4,
      img: "/foods/us-food.jpg",
      name: "차승현의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 5,
      img: "/foods/us-food.jpg",
      name: "차승현의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
    {
      id: 6,
      img: "/foods/us-food.jpg",
      name: "차승현의 소셜다이닝",
      address: "서울특별시 강남구 테헤란로 14길 6 남도빌딩 2층",
      date: "2025-03-04",
      tag: ["한식", "요리 교실", "3만원", "28~35세"],
      person: 4,
    },
  ];

  return (
    <div className={styles.home}>
      <Image
        src="/home/socialhome.png"
        alt="socialhome"
        width={1728}
        height={623}
        className={styles.homeImage}
      />
      <div
        className={styles.textContainer1}
        style={{
          whiteSpace: "pre-wrap" /* 단어별 줄바꿈 적용 */,
          wordBreak: "keep-all" /* 한글의 경우 단어 단위로 줄바꿈 */,
        }}
      >
        <h1>여러 사람들과 함께 식사 어떠세요?</h1>
        <p>나이와 성별을 구분하지 않고 모두 식사를 나누며 대화해보세요.</p>
      </div>
      <div
        className={styles.textContainer2}
        style={{
          whiteSpace: "pre-wrap" /* 단어별 줄바꿈 적용 */,
          wordBreak: "keep-all" /* 한글의 경우 단어 단위로 줄바꿈 */,
        }}
      >
        <h1>일상에서 지쳤을 때, 새로운 일상을 만들어 보세요.</h1>
        <p>새로움이 당신을 기다리고 있습니다.</p>
      </div>
      <div className={styles.popularSocialDiningContainer}>
        <h1>인기 소셜다이닝 리스트</h1>
        <ContentSlider contents={contents} />
      </div>
      <div className={styles.popularSocialDiningContainer}>
        <h1>소셜다이닝 후기</h1>
        <ImageSlider contents={reviews} />
      </div>
      <hr className={styles.hr} />
      <footer>
        <p>영진전문대학교 JI-A 5조</p>
        <p>경상북도 칠곡군 지천면 금송로 60</p>
        <p>cjhms002@g.yju.ac.kr</p>
        <p>010-9278-1278</p>
      </footer>
    </div>
  );
}
