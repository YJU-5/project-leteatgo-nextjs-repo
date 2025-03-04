"use client";

import Image from "next/image";
import styles from "./page.module.css";
import ImageSlider from "@/components/ImageSlider/ImageSlider";

export default function Home() {
  const images = [
    "/foods/cn-food.jpg",
    "/foods/jp-food.jpg",
    "/foods/cn-food.jpg",
    "/foods/kr-food.jpg",
    "/foods/us-food.jpg",
    "/foods/kr-food.jpg",
    "/foods/cn-food.jpg",
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
      </div>
      <div>
        <h1>소셜다이닝 후기</h1>
        <ImageSlider images={images} />
      </div>
    </div>
  );
}
