"use client";

import Link from "next/link";
import styles from "./MainHeader.module.css";
import MainHeaderLogin from "./MainHeaderLogin/MainHeaderLogin";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MainHeader() {
  const { t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.headerTitle}>
          Let Eat Go
        </Link>
        <nav>
          <ul className={styles.navBarFirst}>
            <li>
              <Link href="/what-is-social-dining">
                {t.mainHeader.whatIsSocialDining}
              </Link>
            </li>
            <li>
              <Link href="/start">{t.mainHeader.start}</Link>
            </li>
            <li>
              <Link href="/album">{t.mainHeader.album}</Link>
            </li>
            <li>
              <Link href="/map">{t.mainHeader.map}</Link>
            </li>
            <li>
              <Link href="/reviews">{t.mainHeader.reviews}</Link>
            </li>
          </ul>
          <div className={styles.headerRight}>
            <MainHeaderLogin />
          </div>
        </nav>
      </div>
      <div className={styles.gradient}></div>
    </header>
  );
}
