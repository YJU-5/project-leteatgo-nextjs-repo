"use client"
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import ReviewModal from "@/components/ReviewModal/ReviewModal"
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  pictureUrl: string;
  title: string;
  date: string;
  reviews: number;
  completed: boolean;
  createdAt: string;
}

export default function Reviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:3001/user/joined", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // 또는 cookie
          },
        });

        if (!res.ok) throw new Error("데이터 불러오기 실패");

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("채팅방 목록을 불러오지 못했습니다.", err);
      }
    };

    fetchReviews();
  }, []);

  console.log(reviews);

  const handleOpenModal = (reviews: Review) => {
    setSelectedReview(reviews);
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setSelectedReview(null);
    setShowModal(false);
  };

  const eventdetail = (id: string) => {
    router.push(`/mypage/eventdetail/${id}`);
  }

  return (
    <div className={styles.reviews}>
      <h1 className={styles.reviewsTitle}>방문한 곳 목록</h1>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div className={styles.reviewsListItem} key={review.id}>
            <div className={styles.reviewsListItemImage}>
              <Image
                src={review.pictureUrl || '/foods/cn-food.jpg'}
                alt={review.title}
                onClick={() => eventdetail(review.id)}
                width={400}
                height={200}
              />
            </div>
            <div className={styles.reviewsListItemContent}>
              <h1 className={styles.reviewsListItemTitle}>{review.title}</h1>
              <p className={styles.reviewsListItemDate}>{review.createdAt.split('T')[0].split('-').join('.')}</p>
              <p className={styles.reviewsListItemReviews}>
                {review.reviews}개의 후기
              </p>
              <div className={styles.reviewsListItemCompleted}>
                {review.completed ? (
                  <p>후기 작성을 완료하였습니다.</p>
                ) : (
                  <button onClick={() => handleOpenModal(review)}>후기 작성하기</button>
                )}
              </div>
            </div>
          </div>
        ))}

        {showModal && selectedReview && (
          <ReviewModal onClose={handleCloseModal} review={selectedReview} />
        )}
      </div>
    </div>
  );
}
