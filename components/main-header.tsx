import Link from "next/link";
import styles from "./main-header.module.css";

export default function MainHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <Link href="/" className={styles.header_title}>
          Let Eat Go
        </Link>
        <nav>
          <ul className={styles.nav_bar_first}>
            <li>
              <Link href="/">소셜다이닝이란?</Link>
            </li>
            <li>
              <Link href="/">시작하기</Link>
            </li>
            <li>
              <Link href="/">사진첩</Link>
            </li>
            <li>
              <Link href="/">MAP</Link>
            </li>
            <li>
              <Link href="/">후기</Link>
            </li>
          </ul>
          <ul className={styles.nav_login}>
            <li>
              <Link href="/">로그인</Link>
            </li>
            <li>
              <Link href="/">회원가입</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.gradient}></div>
    </header>
  );
}
