"use client"
import EventList from "@/components/MyPage/EventList/EventList";
import styles from "./page.module.css"
import { useState } from "react";

interface event {
  id: number;
  title: string;
  date: string;
  img: string;
  address: string;
}

export default function MyeventHistory() {


  const event: event[] = [
    {
      id: 1,
      title: "리뷰 제목 1",
      date: "2024.10.15",
      img: "/gitb.png",
      address: "서울특별시 강남구 테헤란로",
    },
    {
      id: 2,
      title: "리뷰 제목 2",
      date: "2024.11.05",
      img: "/gitb.png",
      address: "경기도 성남시 분당구 정자동",
    },
    {
      id: 3,
      title: "리뷰 제목 3",
      date: "2024.12.20",
      img: "/gitb.png",
      address: "부산광역시 해운대구",
    },
    {
      id: 4,
      title: "리뷰 제목 4",
      date: "2024.09.18",
      img: "/gitb.png",
      address: "대구광역시 중구 동성로",
    },
    {
      id: 5,
      title: "리뷰 제목 5",
      date: "2024.08.25",
      img: "/gitb.png",
      address: "인천광역시 연수구 송도동",
    },
    {
      id: 6,
      title: "리뷰 제목 6",
      date: "2024.07.12",
      img: "/gitb.png",
      address: "광주광역시 서구 치평동",
    },
    {
      id: 7,
      title: "리뷰 제목 7",
      date: "2024.06.30",
      img: "/gitb.png",
      address: "대전광역시 서구 둔산동",
    },
    {
      id: 8,
      title: "리뷰 제목 8",
      date: "2024.05.22",
      img: "/gitb.png",
      address: "울산광역시 남구",
    },
    {
      id: 9,
      title: "리뷰 제목 9",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
    {
      id: 10,
      title: "리뷰 제목 10",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
    {
      id: 11,
      title: "리뷰 제목 11",
      date: "2024.05.22",
      img: "/gitb.png",
      address: "울산광역시 남구",
    },
    {
      id: 12,
      title: "리뷰 제목 12",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
    {
      id: 13,
      title: "리뷰 제목 13",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
    {
      id: 14,
      title: "리뷰 제목 14",
      date: "2024.05.22",
      img: "/gitb.png",
      address: "울산광역시 남구",
    },
    {
      id: 15,
      title: "리뷰 제목 15",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
    {
      id: 16,
      title: "리뷰 제목 16",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
    {
      id: 17,
      title: "리뷰 제목 17",
      date: "2024.05.22",
      img: "/gitb.png",
      address: "울산광역시 남구",
    },
    {
      id: 18,
      title: "리뷰 제목 18",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
    {
      id: 19,
      title: "리뷰 제목 19",
      date: "2024.04.10",
      img: "/gitb.png",
      address: "제주특별자치도 제주시",
    },
  ];

  const total = event.length;  //개시물의 총 개수


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>내 개최 조회({event.length})</h1>
      </div>
      <EventList
        list={event}
        total = {total}
      />
    </div>
  )
}