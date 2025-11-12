"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={`${styles.langButton} ${
          language === "ko" ? styles.active : ""
        }`}
        onClick={() => setLanguage("ko")}
        title="한국어"
        aria-label="한국어로 변경"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg"
          alt="한국 국기"
          width={20}
          height={20}
          className={styles.flagImage}
        />
      </button>
      <button
        className={`${styles.langButton} ${
          language === "ja" ? styles.active : ""
        }`}
        onClick={() => setLanguage("ja")}
        title="日本語"
        aria-label="일본어로 변경"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg"
          alt="일본 국기"
          width={20}
          height={20}
          className={styles.flagImage}
        />
      </button>
    </div>
  );
}
