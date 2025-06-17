"use client";

import { useEffect, useState } from "react";
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
  const [history, setHistory] = useState({
    host: [
      {
        title: "차승현의 소셜다이닝",
        createdAt: "2025-03-04",
        pictureUrl: "/foods/kr-food.jpg",
      }
    ],
    participate: [
      {
        title: "김형선의 소셜다이닝",
        createdAt: "2025-03-04",
        pictureUrl: "/foods/kr-food.jpg",
      }
    ],
  });

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/review/averagesreview`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("리뷰 데이터를 가져오는데 실패했습니다.", error);
      }
    }

    const fetchuser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
        );
        const user = await response.json()
        setUser(user)
      } catch (error) {
        console.error("유저 정보를 가져오는데 실패했습니다.", error);
      }
    }

    const fetchhistory = async () => {
      try {
        const [hostResponse, joinResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/hosted`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/joined`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }),
        ]);

        // 두 응답을 모두 JSON으로 변환
        const hostData = await hostResponse.json();
        const joinData = await joinResponse.json();

        // state에 한 번에 저장
        setHistory({
          host: hostData.data || hostData, // 백엔드 응답 구조에 따라 data 또는 그대로
          participate: joinData.data || joinData,
        });
      } catch (error) {
        console.error("이력 정보를 가져오는데 실패했습니다.", error);
      }
    };

    fetchhistory() // 데이터와 유저 정보를 가져오는 함수 호출
    fetchdata() // 리뷰 데이터를 가져오는 함수 호출
    fetchuser() // 유저 정보를 가져오는 함수 호출
  }, [])

  console.log(history);

  // 평균을 소수점 첫째 자리까지 계산하는 함수
  const calculateAverage = (numbers: number[]): number => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / numbers.length).toFixed(1));
  };

  // 문자열에서 형식 날짜까지보여주는 함수
  const formatDate = (isoString: string | null): string => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  }

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
            <div className={styles.historyItem} key={`${item.createdAt}-${index}`}>
              <Image
                src={item.pictureUrl}
                alt={item.title}
                width={100}
                height={100}
                className={styles.historyImage}
              />
              <div className={styles.historyTextContainer}>
                <h3 className={styles.historyTitle}>{item.title}</h3>
                <p className={styles.historyDate}>{formatDate(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.historyWrap}>
          <h2>참여 이력</h2>
          {history.participate.map((item, index) => (
            <div className={styles.historyItem} key={`${item.createdAt}-${index}`}>
              <Image
                src={item.pictureUrl || "/restaurant.jpg"}
                alt={item.title}
                width={100}
                height={100}
                className={styles.historyImage}
              />
              <div className={styles.historyTextContainer}>
                <h3 className={styles.historyTitle}>{item.title}</h3>
                <p className={styles.historyDate}>{formatDate(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


