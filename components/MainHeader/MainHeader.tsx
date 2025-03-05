import Link from "next/link";
import styles from "./MainHeader.module.css";

export default function MainHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.headerTitle}>
          Let Eat Go
        </Link>
        <nav>
          <ul className={styles.navBarFirst}>
            <li>
              <Link href="/what-is-social-dining">소셜다이닝이란?</Link>
            </li>
            <li>
              <Link href="/start">시작하기</Link>
            </li>
            <li>
              <Link href="/album">사진첩</Link>
            </li>
            <li>
              <Link href="/map">MAP</Link>
            </li>
            <li>
              <Link href="/reviews">후기</Link>
            </li>
          </ul>
          <ul className={styles.navLogin}>
            <li>
              <Link href="/login">소셜 로그인</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.gradient}></div>
    </header>
  );
}
