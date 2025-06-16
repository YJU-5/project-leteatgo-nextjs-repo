"use client";

import Link from "next/link";
import styles from "./MainHeader.module.css";
import MainHeaderLogin from "./MainHeaderLogin/MainHeaderLogin";
import { useState } from "react";

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.headerTitle}>
          Let Eat Go
        </Link>
        <button
          className={`${styles.mobileMenuButton} ${
            isMenuOpen ? styles.active : ""
          }`}
          onClick={toggleMenu}
          aria-label="메뉴 열기"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
          <ul className={styles.navBarFirst}>
            <li>
              <Link
                href="/what-is-social-dining"
                onClick={() => setIsMenuOpen(false)}
              >
                소셜다이닝이란?
              </Link>
            </li>
            <li>
              <Link href="/start" onClick={() => setIsMenuOpen(false)}>
                시작하기
              </Link>
            </li>
            <li>
              <Link href="/album" onClick={() => setIsMenuOpen(false)}>
                사진첩
              </Link>
            </li>
            <li>
              <Link href="/map" onClick={() => setIsMenuOpen(false)}>
                MAP
              </Link>
            </li>
            <li>
              <Link href="/reviews" onClick={() => setIsMenuOpen(false)}>
                후기
              </Link>
            </li>
          </ul>
          <MainHeaderLogin />
        </nav>
      </div>
      <div className={styles.gradient}></div>
    </header>
  );
}
