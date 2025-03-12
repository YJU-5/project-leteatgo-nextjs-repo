"use client";
import React from "react";
import styles from "./MyReviews.module.css";

interface Review {
  id: number;
  title: string;
  date: string;
  img:string;
  location:string;
}

export default function MyReviews() {
  const reviews: Review[] = [
    { id: 1, title: "리뷰 제목", date: "2024.11.30",img:"/gitb.png", location:"서울특별시 어쩌구" },
    { id: 2, title: "리뷰 제목", date: "2024.11.30",img:"/gitb.png",location:"서울특별시 어쩌구"},
    { id: 3, title: "리뷰 제목", date: "2024.11.30",img:"/gitb.png",location:"서울특별시 어쩌구" },
    { id: 4, title: "리뷰 제목", date: "2024.11.30",img:"/gitb.png",location:"서울특별시 어쩌구" },
    { id: 5, title: "리뷰 제목", date: "2024.11.30",img:"/gitb.png",location:"서울특별시 어쩌구" },
    { id: 6, title: "리뷰 제목", date: "2024.11.30",img:"/gitb.png",location:"서울특별시 어쩌구" },
    { id: 7, title: "리뷰 제목", date: "2024.11.30",img:"/gitb.png",location:"서울특별시 어쩌구" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>내 후기 조회({reviews.length})</h1>
      </div>
      <div className={styles.itemsContainer}>
        {
          reviews.map((review)=>(
            <div key={review.id} className={styles.reviewCard}>
          <img src={review.img} className={styles.reviewImage} />
          <div className={styles.reviewContent}>
            <h3 className={styles.reviewTitle}>{review.title}</h3>
            <p className={styles.reviewLocation}>{review.location}</p>
          </div>
          <span className={styles.reviewDate}>{review.date}</span>
        </div>
          ))
        }

      </div>
    </div>
  );
}