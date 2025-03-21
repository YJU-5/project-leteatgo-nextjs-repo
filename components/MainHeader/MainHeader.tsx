import Link from "next/link";
import styles from "./MainHeader.module.css";
import NavLogin from "../NavLogin/NavLogin";

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
              <Link href="/album">공유하기</Link>
            </li>
            <li>
              <Link href="/map">근처 소셜다이닝</Link>
            </li>
            <li>
              <Link href="/reviews">후기 작성하기</Link>
            </li>
          </ul>
          <ul className={styles.navLogin}>
            <NavLogin />
          </ul>
        </nav>
      </div>
      <div className={styles.gradient}></div>
    </header>
  );
}
