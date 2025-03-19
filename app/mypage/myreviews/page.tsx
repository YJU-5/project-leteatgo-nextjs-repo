"use client";
import React, { useRef, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface Review {
  id: number;
  title: string;
  date: string;
  img: string;
  location: string;
}

export default function MyReviews() {

  const router = useRouter();
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews: Review[] = [
    { id: 1, title: "리뷰 제목1", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 2, title: "리뷰 제목2", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 3, title: "리뷰 제목3", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 4, title: "리뷰 제목4", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 5, title: "리뷰 제목5", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 6, title: "리뷰 제목6", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 7, title: "리뷰 제목7", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 8, title: "리뷰 제목4", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 9, title: "리뷰 제목5", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 10, title: "리뷰 제목6", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },
    { id: 11, title: "리뷰 제목7", date: "2024.11.30", img: "/gitb.png", location: "서울특별시 어쩌구" },

  ];


  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!scrollRef.current) return;

    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  }

  const onDragEnd = () => {
    setIsDrag(false);
  }

  const onDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrag || !scrollRef.current) return;

    scrollRef.current.scrollLeft = startX - e.pageX;
  }

  const handleReviewsDetail=(id:number,title:string)=>{
    router.push(`/mypage/myreviews/${id}`)
  }




  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>내 후기 조회({reviews.length})</h1>
      </div>
      <div
        className={styles.itemsWrapper}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        ref={scrollRef}>
        <div className={styles.itemsContainer}>
          {
            reviews.map((review) => (
              <div
                onClick={()=>handleReviewsDetail(review.id,review.title)}
                key={review.id}
                className={styles.reviewCard}
              >
                <Image
                  width={120}
                  height={120}
                  src={review.img}
                  className={styles.reviewImage}
                  alt={"후기사진"} />
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

    </div>
  );
}