"use client"
import { useSelector } from "react-redux";
import styles from "./page.module.css"
import { RootState } from "@/store/Store";
import { useState } from "react";


export default function Inquiry() {

  const user = useSelector((state: RootState) => state.user.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>1:1 문의</h1>
        </div>
        <div className={styles.formGroup}>
          <span className={styles.author}>작성자: {user?.name} </span>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>제목</label>
          <input
            type="text"
            id="title"
            className={styles.input}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>내용</label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            className={styles.textArea}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
  )
}