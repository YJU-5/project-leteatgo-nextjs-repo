"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from './eventlist.module.css'

interface List {
  id: number;
  title: string;
  date: string;
  img: string;
  address: string;
}

interface ReviewListProps {
  list: List[];
}

export default function EventList({ list }: ReviewListProps) {
  const router = useRouter();
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [isClick, setIsClick] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageSize = 9;
  const [sliceReviews, setSliceReviews] = useState<List[]>(list.slice(0, pageSize)); // 처음에는 9개만 렌더링

  // 개시물 추가
  const loadMore = () => {
    setSliceReviews((prev) => [
      ...prev,
      ...list.slice(prev.length, prev.length + pageSize)
    ]);
    console.log('게시글 늘어남');
  };

  // 드래그 시작
  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!scrollRef.current) return;

    setIsDrag(true);
    setIsClick(true);
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

    if (Math.abs(startX - e.pageX) > 5) {
      setIsClick(false); // 일정 거리 이상 움직이면 클릭 비활성화
    }

    // 스크롤이 끝에 도달하면 loadMore 실행
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (list.length !== sliceReviews.length && scrollLeft + clientWidth >= scrollWidth - 10) {
      loadMore();
    }
  };

  // 상세 페이지 이동
  const handleReviewsDetail = (id: number) => {
    if (!isClick) return;
    router.push(`/mypage/eventlist/${id}`);
  };

  return (
    <div
      className={styles.itemsScroll}
      onMouseDown={onDragStart}
      onMouseMove={handleDragAndScroll} 
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      ref={scrollRef}
    >
      <div className={styles.itemsContainer}>
        {sliceReviews.map((review) => (
          <div
            onClick={() => handleReviewsDetail(review.id)}
            key={review.id}
            className={styles.reviewCard}
          >
            <Image
              width={140}
              height={140}
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
  );
}
