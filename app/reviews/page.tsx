import styles from "./page.module.css";
import Image from "next/image";

interface Review {
  id: string;
  image: string;
  title: string;
  date: string;
  reviews: number;
  completed: boolean;
}

export default function Reviews() {
  const reviews: Review[] = [
    {
      id: "1",
      image: "/foods/kr-food.jpg",
      title: "차승현님의 소셜다이닝",
      date: "2025-02-27",
      reviews: 0,
      completed: false,
    },
    {
      id: "2",
      image: "/foods/jp-food.jpg",
      title: "김형선님의 소셜다이닝",
      date: "2025-02-27",
      reviews: 1,
      completed: true,
    },
    {
      id: "3",
      image: "/foods/us-food.jpg",
      title: "홍태관님의 소셜다이닝",
      date: "2025-02-27",
      reviews: 2,
      completed: true,
    },
  ];

  return (
    <div className={styles.reviews}>
      <h1 className={styles.reviewsTitle}>방문한 곳 목록</h1>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div className={styles.reviewsListItem} key={review.id}>
            <div className={styles.reviewsListItemImage}>
              <Image
                src={review.image}
                alt={review.title}
                width={400}
                height={200}
              />
            </div>
            <div className={styles.reviewsListItemContent}>
              <h1 className={styles.reviewsListItemTitle}>{review.title}</h1>
              <p className={styles.reviewsListItemDate}>{review.date}</p>
              <p className={styles.reviewsListItemReviews}>
                {review.reviews}개의 후기
              </p>
              <div className={styles.reviewsListItemCompleted}>
                {review.completed ? (
                  <p>후기 작성을 완료하였습니다.</p>
                ) : (
                  <button>후기 작성하기</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
