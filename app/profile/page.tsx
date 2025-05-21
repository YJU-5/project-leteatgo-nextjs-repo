"use client";

import { useState } from "react";
import styles from "./page.module.css";
import RadarChart from "@/components/RadarChart/RadarChart";
import Chart from "@/components/Chart/Chart";
import Image from "next/image";
import ProfileChange from "@/components/ProfileChange/ProfileChange";

export default function ProfilePage() {
  const [data /* setData */] = useState([3.5, 4.5, 3.5, 4.5, 3.5]);
  const [user /* setUser */] = useState({
    name: "차승현",
    introduction: "안녕하세요",
  });
  const [history /* setHistory */] = useState({
    host: [
      {
        title: "차승현의 소셜다이닝",
        date: "2025-03-04",
        image: "/foods/kr-food.jpg",
      },
      {
        title: "차승현의 소셜다이닝",
        date: "2025-03-03",
        image: "/foods/kr-food.jpg",
      },
      {
        title: "차승현의 소셜다이닝",
        date: "2025-03-02",
        image: "/foods/kr-food.jpg",
      },
    ],
    participate: [
      {
        title: "김형선의 소셜다이닝",
        date: "2025-03-04",
        image: "/foods/kr-food.jpg",
      },
      {
        title: "홍태관의 소셜다이닝",
        date: "2025-03-03",
        image: "/foods/us-food.jpg",
      },
      {
        title: "구진모의 소셜다이닝",
        date: "2025-03-02",
        image: "/foods/cn-food.jpg",
      },
    ],
  });

  const calculateAverage = (numbers: number[]): number => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / numbers.length).toFixed(1));
  };

  return (
    <div className={styles.profile}>
      <div className={styles.backgroundProfileImage}>
        <ProfileChange
          currentProfileImage="/gitb.png"
          currentBackgroundImage="/foods/kr-food.jpg"
          onProfileImageChange={() => {
            // 프로필 이미지 업로드 처리
          }}
          onBackgroundImageChange={() => {
            // 배경 이미지 업로드 처리
          }}
        />
        <div className={styles.nameContainer}>
          <h1>{user.name}</h1>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chartWrap}>
          <RadarChart data={data} />
          <div className={styles.rightChart}>
            <div className={styles.average}>
              <Image
                src="/profile/crown.png"
                alt="crown"
                width={25}
                height={25}
                className={styles.crown}
              />
              {calculateAverage(data)}
            </div>
            <Chart data={data} />
          </div>
        </div>
      </div>
      <div className={styles.introductionContainer}>
        <div className={styles.introduction}>
          <h2>자기소개</h2>
          <p>{user.introduction}</p>
        </div>
      </div>
      <div className={styles.historyContainer}>
        <div className={styles.historyWrap}>
          <h2>개최 이력</h2>
          {history.host.map((item, index) => (
            <div className={styles.historyItem} key={`${item.date}-${index}`}>
              <Image
                src={item.image}
                alt={item.title}
                width={100}
                height={100}
                className={styles.historyImage}
              />
              <div className={styles.historyTextContainer}>
                <h3 className={styles.historyTitle}>{item.title}</h3>
                <p className={styles.historyDate}>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.historyWrap}>
          <h2>참여 이력</h2>
          {history.participate.map((item, index) => (
            <div className={styles.historyItem} key={`${item.date}-${index}`}>
              <Image
                src={item.image}
                alt={item.title}
                width={100}
                height={100}
                className={styles.historyImage}
              />
              <div className={styles.historyTextContainer}>
                <h3 className={styles.historyTitle}>{item.title}</h3>
                <p className={styles.historyDate}>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
