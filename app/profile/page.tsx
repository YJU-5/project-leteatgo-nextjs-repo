"use client";

import { useState } from "react";
import styles from "./page.module.css";
import RadarChart from "@/components/RadarChart/RadarChart";
import Chart from "@/components/Chart/Chart";
import Image from "next/image";
import ProfileChange from "@/components/ProfileChange/ProfileChange";

export default function ProfilePage() {
  const [data, setData] = useState([3.5, 4.5, 3.5, 4.5, 3.5]);
  const [user, setUser] = useState({
    name: "차승현",
    introduction: "안녕하세요",
  });

  const calculateAverage = (numbers: number[]): number => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / numbers.length).toFixed(1));
  };

  return (
    <div className={styles.profile}>
      <div className={styles.backgroundProfileImage}>
        <ProfileChange
          currentProfileImage="/profile/hat.png"
          currentBackgroundImage="/profile/background.png"
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
    </div>
  );
}
