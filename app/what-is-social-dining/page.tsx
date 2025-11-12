"use client";

import styles from "./page.module.css";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhatIsSocialDining() {
  const { t } = useLanguage();

  return (
    <div className={styles.whatIsSocialDining}>
      <Image
        src="/restaurant.jpg"
        alt="restaurant"
        width={1728}
        height={1023}
        className={styles.whatIsSocialDiningImage}
        priority
      />
      <div className={styles.whatIsSocialDiningTextContainer}>
        <h1
          className={`${styles.whatIsSocialDiningTitle} ${styles.upContent} ${styles.delay1}`}
        >
          {t.whatIsSocialDining.title}
        </h1>
        <p
          className={`${styles.whatIsSocialDiningText} ${styles.upContent} ${styles.delay2}`}
        >
          {t.whatIsSocialDining.description1}
        </p>
        <p
          className={`${styles.whatIsSocialDiningText} ${styles.upContent} ${styles.delay3}`}
        >
          {t.whatIsSocialDining.description2}
        </p>
        <ul>
          <p
            className={`${styles.whatIsSocialDiningText} ${styles.upContent} ${styles.delay4}`}
          >
            {t.whatIsSocialDining.examplesTitle}
          </p>
          <li className={`${styles.upContent} ${styles.delay5}`}>
            {t.whatIsSocialDining.example1}
          </li>
          <li className={`${styles.upContent} ${styles.delay5}`}>
            {t.whatIsSocialDining.example2}
          </li>
        </ul>
      </div>
    </div>
  );
}
