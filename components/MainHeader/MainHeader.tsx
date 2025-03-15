import Link from "next/link";
import styles from "./MainHeader.module.css";
import MainHeaderLogin from "./MainHeaderLogin/MainHeaderLogin";

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
            <MainHeaderLogin/>
        </nav>
      </div>
      <div className={styles.gradient}></div>
    </header>
  );
}
