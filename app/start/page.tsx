import styles from "./page.module.css";

export default function Start() {
  return (
    <div className={styles.start}>
      <div className={styles.top_container}>
        <div className={styles.button_group}>
          <button className={styles.create_room}>개최하기</button>
          <button className={styles.join_room}>참가하기</button>
        </div>
      </div>
      <hr />
      <div className={styles.under_container}>
        <h1 className={styles.popular_title}>현재 인기 소셜 다이닝</h1>
        <div className={styles.popular_item}>아잉</div>
        <div className={styles.popular_item}></div>
        <div className={styles.popular_item}></div>
      </div>
    </div>
  );
}
