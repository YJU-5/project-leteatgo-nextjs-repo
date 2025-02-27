import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
export default function Join() {
  return (
    <div className={styles.join}>
      <div className={styles.join_container}>
        <Link href="/start/join/food" className={styles.join_container_wrap}>
          <div className={styles.top_content}>
            <Image
              src="/foods/kr-food.jpg"
              alt="한식"
              width={1000}
              height={1000}
              className={styles.top_content_image}
            />
          </div>
          <div className={styles.under_content}>
            <h1>한식</h1>
            <p>한국 음식을 좋아하는 사람들을 위한 소셜 다이닝</p>
          </div>
        </Link>
        <Link href="/start/join/food" className={styles.join_container_wrap}>
          <div className={styles.top_content}>
            <Image
              src="/foods/cn-food.jpg"
              alt="중식"
              width={1000}
              height={1000}
              className={styles.top_content_image}
            />
          </div>
          <div className={styles.under_content}>
            <h1>중식</h1>
            <p>중국 음식을 좋아하는 사람들을 위한 소셜 다이닝</p>
          </div>
        </Link>
        <Link href="/start/join/food" className={styles.join_container_wrap}>
          <div className={styles.top_content}>
            <Image
              src="/foods/jp-food.jpg"
              alt="일식"
              width={1000}
              height={1000}
              className={styles.top_content_image}
            />
          </div>
          <div className={styles.under_content}>
            <h1>일식</h1>
            <p>일본 음식을 좋아하는 사람들을 위한 소셜 다이닝</p>
          </div>
        </Link>
        <Link href="/start/join/food" className={styles.join_container_wrap}>
          <div className={styles.top_content}>
            <Image
              src="/foods/us-food.jpg"
              alt="양식"
              width={1000}
              height={1000}
              className={styles.top_content_image}
            />
          </div>
          <div className={styles.under_content}>
            <h1>양식</h1>
            <p>서양 음식을 좋아하는 사람들을 위한 소셜 다이닝</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
