"use client"
import { useState,useEffect } from "react";
import styles from "./page.module.css";
import EventList from "@/components/MyPage/EventList/EventList";


interface Review {
  id: number;
  title: string;
  date: string;
  pictureUrl: string;
  address: string;
  chatRoomId:string;
  createdAt: string;
}


export default function MyReviewList() {

  const [reviews,setReviews]= useState<Review[]>([]);

  useEffect(() => {
      async function getEvents() {
        const res = await fetch("http://localhost:3001/review/userreview", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setReviews(data);
      }
      getEvents();
    }, []);
    console.log('reviews',reviews);

  // const reviews: Review[] = [
  //   {
  //     id: 1,
  //     title: "리뷰 제목 1",
  //     date: "2024.10.15",
  //     pictureUrl: "/gitb.png",
  //     address: "서울특별시 강남구 테헤란로",
  //     createdAt:'2025-03-01'
  //   },
  //   {
  //     id: 2,
  //     title: "리뷰 제목 2",
  //     date: "2024.11.05",
  //     pictureUrl: "/gitb.png",
  //     address: "경기도 성남시 분당구 정자동",
  //     createdAt:'2025-03-01'
  //   },
  //   {
  //     id: 3,
  //     title: "리뷰 제목 3",
  //     date: "2024.12.20",
  //     pictureUrl: "/gitb.png",
  //     address: "부산광역시 해운대구",
  //     createdAt:'2025-03-01'
  //   },
  // ];

  const total = reviews.length;  //개시물의 총 개수


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>내 후기 조회({reviews.length})</h1>
      </div>
      <EventList
        list={reviews}
        total={total}
      />
    </div>
  );
}