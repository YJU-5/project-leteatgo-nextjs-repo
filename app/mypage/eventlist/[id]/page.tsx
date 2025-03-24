"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import styles from "./page.module.css";

interface ReviewDetailProps {
  params: { id: string };
}

interface Review {
  id: number;
  name: string;
  content: string;
  profile: string;
  img: string[];
}

export default function MyReviewsDetail({ params }: ReviewDetailProps) {
  const searchParams = useSearchParams();
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  const tagList = ["양식", "요리교실", "3만원"];

  const reviews: Review[] = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: "구**",
    content: "아 너무 좋았어용 처음인데도 너무 잘 대해주시고, 다음에 또 기회가 된다면 가보고 싶어용",
    profile: "/gitb.png",
    img: ["/gitb.png", "/restaurant.jpg", "/gitb.png"],
  }));

  const [sliceReviews, setSliceReviews] = useState<Review[]>(reviews.slice(0, pageSize));

  // 개시물 추가
  const loadMore = () => {
    setSliceReviews((prev) => [
      ...prev,
      ...reviews.slice(prev.length, prev.length + pageSize),
    ]);
    console.log("게시글 늘어남");
  };

  // 드래그 시작
  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!scrollRef.current) return;

    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  // 드래그 종료
  const onDragEnd = () => {
    setIsDrag(false);
  };

  // 드래그 이동 + 스크롤 감지
  const handleDragAndScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrag || !scrollRef.current) return;

    // 드래그 이동 처리
    scrollRef.current.scrollLeft = startX - e.pageX;

    // 스크롤이 끝에 도달하면 loadMore 실행
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (reviews.length !== sliceReviews.length && scrollLeft + clientWidth >= scrollWidth - 10) {
      loadMore();
    }
  };

  return (
    <div className={styles.reviewDetail}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>김형선의 파티</h1>
          <p className={styles.date}>2024.11.30</p>
          <p className={styles.address}>서울특별시 마포구</p>
          <div className={styles.tag}>
            <Image width={30} height={30} src="/Tag.png" alt="태그 아이콘" />
            {tagList.map((tag, index) => (
              <div key={index}>{tag}</div>
            ))}
          </div>
        </div>

        <div className={styles.imageContainer}>
          <Image width={300} height={300} src="/gitb.png" alt="메인 이미지" className={styles.mainImg} />
          <div className={styles.subImageContainer}>
            <Image width={150} height={146} src="/restaurant.jpg" alt="서브 이미지 1" className={styles.subImage} />
            <Image width={150} height={146} src="/favicon.png" alt="서브 이미지 2" className={styles.subImage} />
          </div>
        </div>
      </div>

      <p className={styles.reviewCount}>후기목록({reviews.length})</p>
      <div
        className={styles.itemsScroll}
        onMouseDown={onDragStart}
        onMouseMove={handleDragAndScroll} // ✅ 드래그 이동 + 스크롤 감지 통합
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        ref={scrollRef}
      >
        <div className={styles.reviewContainer}>
          {sliceReviews.map((review) => (
            <div className={styles.reviewCard} key={review.id}>
              <div className={styles.user}>
                <h1>{review.name}</h1>
                <Image width={60} height={60} src={review.profile} alt="유저프로필" className={styles.profileImg} />
              </div>
              <p className={styles.reviewText}>{review.content}</p>
              <div className={styles.reviewImageContainer}>
                <Image width={200} height={200} src={review.img[0]} alt="메인 이미지" className={styles.reviewMainImg} />
                <div className={styles.reviewSubImageContainer}>
                  <Image width={100} height={92} src={review.img[1]} alt="서브 이미지 1" className={styles.reviewSubImage} />
                  <Image width={100} height={92} src={review.img[2]} alt="서브 이미지 2" className={styles.reviewSubImage} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
