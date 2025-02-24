import styles from "./page.module.css";
import Link from "next/link";

export default function Start() {
  return (
    <div className={styles.start}>
      <div className={styles.top_container}>
        <div className={styles.button_group}>
          <Link href="/start/create" className={styles.create_room}>
            개최하기
          </Link>
          <Link href="/start/join" className={styles.join_room}>
            참가하기
          </Link>
        </div>
      </div>
      <hr />
      <div className={styles.under_container}>
        <h1 className={styles.popular_title}>현재 인기 소셜 다이닝</h1>
        <div className={styles.popular_item}>아잉</div>
        <div className={styles.popular_item}></div>
        <div className={styles.popular_item}></div>
        <div className={styles.popular_item}></div>
      </div>
    </div>
  );
}
