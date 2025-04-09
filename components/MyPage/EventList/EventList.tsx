"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import styles from './EventList.module.css'
import { start } from "repl";

interface List {
  id: number;
  title: string;
  date: string;
  img: string;
  address: string;
}

interface EventListProps {
  list: List[];
  total: number;
}

export default function EventList({ list, total}: EventListProps) {
  const router = useRouter();
  const [page, setPage] = useState(1); //현재 페이지 번호
  const [prevPage, setPrevPage] = useState(1); // 이전페이지 번호
  const [slideClass, setSlideClass] = useState("");// 한페이지에 표시할 데이터수 
  const [limit, setLimit] = useState(9) //페이지당 개수
  const pageNum = Math.ceil(total / limit) // 전체 페이지 개수
  const offset = (page - 1) * limit; //현재 페이지에서 표시할 데이터의 시작위치

  const slicePageData = list.slice(offset, offset + limit); //현재 페이지의 데이터만 가지고오기
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (page > prevPage) {
      setSlideClass(styles.slideFromRight) ; // 오른쪽으로 슬라이드
    }else if (page < prevPage){
      setSlideClass(styles.slideFromLeft);
    }

    setPrevPage(page);

  // 0.4초 뒤 슬라이드 클래스 초기화
  const timeout = setTimeout(() => setSlideClass(""), 400);
  return () => clearTimeout(timeout);
}, [page]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newLimit = 9;
  
      if (width <= 640) newLimit = 4;
      else if (width <= 1115) newLimit = 4;
  
      setLimit((prevLimit) => {
        if (prevLimit !== newLimit) {
          const firstIndex = (page - 1) * prevLimit;
          const newPage = Math.floor(firstIndex / newLimit) + 1;
  
          // limit이 바뀐 후에 setPage를 호출할 수 있도록
          setTimeout(() => {
            setPage(newPage);
          }, 0);
        }
  
        return newLimit;
      });
    };
  
    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, [page]);

  const handleMouseDonw = (e: React.MouseEvent<HTMLDivElement>) => {
    startX.current = e.clientX; //마우스 클릭시 시작위치
    isDragging.current = true;  //드래그 확인
  }


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
  }

  // 상세 페이지 이동
  const handleReviewsDetail = (id: number) => {
    router.push(`/mypage/evendetail/${id}`);
  };

  return (
    <div>
      <div
        className={styles.itemsScroll}
        style={{ userSelect: 'none' }} //드래그 방지
        onMouseDown={handleMouseDonw}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={`${styles.itemsContainer} ${slideClass}`}>
          {slicePageData.map((review) => (
            <div
              onClick={() => handleReviewsDetail(review.id)}
              key={review.id}
              className={styles.reviewCard}
            >
              <Image
                width={100}
                height={100}
                src={review.img}
                className={styles.reviewImage}
                alt="후기사진"
              />
              <div className={styles.reviewContent}>
                <h3 className={styles.reviewTitle}>{review.title}</h3>
                <p className={styles.reviewAddress}>{review.address}</p>
              </div>
              <span className={styles.reviewDate}>{review.date}</span>
            </div>
          ))}
        </div>
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

  );
}