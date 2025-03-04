import styles from "./page.module.css";
import Link from "next/link";

export default function Start() {
  return (
    <div className={styles.start}>
      <div className={styles.topContainer}>
        <div className={styles.buttonGroup}>
          <Link href="/start/create" className={styles.createRoom}>
            개최하기
          </Link>
          <Link href="/start/join" className={styles.joinRoom}>
            참가하기
          </Link>
        </div>
      </div>
      <hr />
      <div className={styles.underContainer}>
        <h1 className={styles.popularTitle}>현재 인기 소셜 다이닝</h1>
        <div className={styles.popularItemsContainer}>
          <div className={styles.popularItem}>아잉</div>
          <div className={styles.popularItem}>아잉</div>
          <div className={styles.popularItem}>아잉</div>
          <div className={styles.popularItem}>아잉</div>
        </div>
      </div>
    </div>
  );
}
