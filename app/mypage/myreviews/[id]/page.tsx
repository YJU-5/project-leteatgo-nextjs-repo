"use client"

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css"

interface ReviewDetailProps {
  params: { id: string };
}


export default function myreviewsDitail({ params }: ReviewDetailProps) {
  const searchParams = useSearchParams();
  const tagList = ["양식", '요리교실', '3만원']
  const reviews = [
    { name: '구**', title: '아 너무 좋았어용 처음인데도 너무 잘 대해주시고, 다음에 또 기회가 된다면 가보고 싶어용 !', profile: "/gitb.png", img: ["/gitb.png", "/gitb.png", "/gitb.png"] },
    { name: '차**', title: '아 너무 좋았어용 처음인데도 너무 잘 대해주시고, 다음에 또 기회가 된다면 가보고 싶어용 !', profile: "/gitb.png", img: ["/gitb.png", "/gitb.png", "/gitb.png"] },
    { name: '홍**', title: '아 너무 좋았어용 처음인데도 너무 잘 대해주시고, 다음에 또 기회가 된다면 가보고 싶어용 !', profile: "/gitb.png", img: ["/gitb.png", "/gitb.png", "/gitb.png"] },
    { name: '김**', title: '아 너무 좋았어용 처음인데도 너무 잘 대해주시고, 다음에 또 기회가 된다면 가보고 싶어용 !', profile: "/gitb.png", img: ["/gitb.png", "/gitb.png", "/gitb.png"] },
  ]


  console.log(reviews);
  return (
    <div className={styles.reviewDetail}>
      <div className={styles.container}>
        {/* 상단 정보 */}
        <div>
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

        {/* 이미지 영역 */}
        <div className={styles.imageContainer}>
          <Image width={240} height={240} src="/gitb.png" alt="메인 이미지" />
          <div className={styles.subImageContainer}>
            <Image width={120} height={120} src="/restaurant.jpg" alt="서브 이미지 1" />
            <Image width={120} height={120} src="/favicon.png" alt="서브 이미지 2" />
          </div>
        </div>


      </div>
      <div className={styles.reviewContainer}>
        <div>후기목록()</div>
        {
          reviews.map((review) => (
            <div className={styles.reviewCard}>
              <div>{review.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}