"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface Review {
  id: number;
  name: string;
  content: string;
  profile: string;
  reviewUrl: string[];
}

interface ChatRoom {
  address: string;
  createdAt: string;
  id: string;
  title: string;
  pictureUrl: string;
  minAge: number;
  maxAge: number;
  price: number;
}

export default function MyReviewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [events, setEvents] = useState<ChatRoom | null>(null);
  const [tagList, setTagList] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function getEvents() {
      const res = await fetch(`http://localhost:3001/review/room/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
      setTagList([`${data.minAge}~${data.maxAge}세`,])
      // 여기서 price 변환 예시
      if (data.price !== undefined) {
        // 간단하게 한 줄로 변환
        const displayPrice =
          data.price >= 10000
            ? `${Math.floor(data.price / 10000)}만원`
            : `${data.price}원`;
        setTagList((prev) => [...prev, displayPrice]);
      }
      if (data.reviews) {
        setReviews(data.reviews);
      }
    }
    getEvents();
  }, []);

  console.log(events);


  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const [page, setPage] = useState(1); //현재 페이지 번호
  const [prevPage, setPrevPage] = useState(1); // 이전페이지 번호
  const [slideClass, setSlideClass] = useState("");// 한페이지에 표시할 데이터수 
  const [limit, setLimit] = useState(3) //페이지당 개수
  const offset = (page - 1) * limit; //현재 페이지에서 표시할 데이터의 시작위치


  const total = reviews.length;
  const pageNum = Math.ceil(total / limit) // 전체 페이지 개수
  const slicePageData = reviews.slice(offset, offset + limit); //현재 페이지의 데이터만 가지고오기
  console.log(slicePageData);

  useEffect(() => {
    if (page > prevPage) {
      setSlideClass(styles.slideFromRight); // 오른쪽으로 슬라이드
    } else if (page < prevPage) {
      setSlideClass(styles.slideFromLeft);
    }

    setPrevPage(page);

    // 0.4초 뒤 슬라이드 클래스 초기화
    const timeout = setTimeout(() => setSlideClass(""), 400);
    return () => clearTimeout(timeout);
  }, [page]);


  const handleMouseDonw = (e: React.MouseEvent<HTMLDivElement>) => {
    startX.current = e.clientX; //마우스 클릭시 시작위치
    isDragging.current = true;  //드래그 확인
    console.log(startX.current);
    console.log(isDragging.current);
  };


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || startX.current === null) return;
    const moveX = e.clientX - startX.current //클릭한 지점에서 얼마나 이동했는지 확인


    if (Math.abs(moveX) > 200) { //200px 이상 움직였다면
      isDragging.current = false;

      if (moveX > 0 && page > 1) {
        setPage((prev) => prev - 1);
      } else if (moveX < 0 && page < Math.ceil(total / limit)) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = false;
    startX.current = null;
  };

  return (
    <div className={styles.reviewDetail}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{events?.title}</h1>
          <p className={styles.date}>{events?.createdAt.split('T')[0].split('-').join('.')}</p>
          <p className={styles.address}>{events?.address}</p>
          <div className={styles.tag}>
            <Image width={30} height={30} src="/Tag.png" alt="태그 아이콘" />
            {tagList.map((tag, index) => (
              <div key={index}>{tag}</div>
            ))}
          </div>
        </div>

        <div className={styles.imageContainer}>
          <Image
            width={300}
            height={300}
            src={events?.pictureUrl || "/restaurant.jpg"}
            alt="메인 이미지"
            className={styles.mainImg}
          />
          {/* <div className={styles.subImageContainer}>
            <Image
              width={150}
              height={146}
              src={
              events?.pictureUrl?.[1] && (
                events.pictureUrl[1].startsWith('/')
              )
                ? events.pictureUrl[1]
                : '/restaurant.jpg'
            }
              alt="서브 이미지 1"
              className={styles.subImage}
            />
            <Image
              width={150}
              height={146}
              src={
                events?.pictureUrl?.[0] && (
                  events.pictureUrl[0].startsWith('/')
                )
                  ? events.pictureUrl[0]
                  : '/restaurant.jpg'
              }
              alt="서브 이미지 2"
              className={styles.subImage}
            />
          </div> */}
        </div>
      </div>

      <p className={styles.reviewCount}>후기목록({reviews.length})</p>
      <div
        className={styles.itemsScroll}
        style={{ userSelect: 'none' }}
        onMouseDown={handleMouseDonw}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={`${styles.reviewContainer} ${slideClass}`}>
          {slicePageData.map((review) => (
            <div className={styles.reviewCard} key={review.id}>
              <div className={styles.user}>
                <h1>{review.name}</h1>
                <Image width={60} height={60} src={review.profile} alt="유저프로필" className={styles.profileImg} />
              </div>
              <p className={styles.reviewText}>{review.content}</p>
              <div className={styles.reviewImageContainer}>
                {review.reviewUrl?.[0] && (
                  <Image
                    width={200}
                    height={200}
                    src={review.reviewUrl[0]}
                    alt="메인 이미지"
                    className={styles.reviewMainImg}
                  />
                )}
                <div className={styles.reviewSubImageContainer}>
                  {review.reviewUrl?.[1] && (
                    <Image
                      width={100}
                      height={92}
                      src={review.reviewUrl[1]}
                      alt="서브 이미지 1"
                      className={styles.reviewSubImage}
                    />
                  )}
                  {review.reviewUrl?.[2] && (
                    <Image
                      width={100}
                      height={92}
                      src={review.reviewUrl[2]}
                      alt="서브 이미지 2"
                      className={styles.reviewSubImage}
                    />
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
        <div className={styles.paginationContainer}>
          {Array.from({ length: pageNum }, (_, i) => {
            const pageIndex = i + 1;
            const isActive = page === pageIndex;

            return (
              <button
                key={pageIndex}
                className={`${styles.pageButton} ${isActive ? styles.whiteButton : styles.blackButton}`}
                onClick={() => setPage(pageIndex)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}