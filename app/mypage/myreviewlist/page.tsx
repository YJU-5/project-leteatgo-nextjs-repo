"use client"
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import EventList from "@/components/MyPage/EventList/EventList";


interface Review {
  id: number;
  title: string;
  date: string;
  pictureUrl: string;
  address: string;
  chatRoomId: string;
  createdAt: string;
}


export default function MyReviewList() {

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function getEvents() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/userreview`, {
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
  console.log('reviews', reviews);

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