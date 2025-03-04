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
      <h1 className={styles.reviews_title}>방문한 곳 목록</h1>
      <div className={styles.reviews_list}>
        {reviews.map((review) => (
          <div className={styles.reviews_list_item} key={review.id}>
            <div className={styles.reviews_list_item_image}>
              <Image
                src={review.image}
                alt={review.title}
                width={200}
                height={200}
              />
            </div>
            <div className={styles.reviews_list_item_content}>
              <h1 className={styles.reviews_list_item_title}>{review.title}</h1>
              <p className={styles.reviews_list_item_date}>{review.date}</p>
              <p className={styles.reviews_list_item_reviews}>
                {review.reviews}개의 후기
              </p>
              <p className={styles.reviews_list_item_completed}>
                {review.completed ? (
                  <>
                    <p>후기 작성을 완료하였습니다.</p>
                  </>
                ) : (
                  <>
                    <button>후기 작성하기</button>
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
