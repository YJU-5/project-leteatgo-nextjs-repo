"use client";

import styles from "./page.module.css";
import { useState } from "react";

export default function Create() {
  const [price, setPrice] = useState(0);
  const [age, setAge] = useState(0);

  return (
    <div className={styles.create}>
      <div className={styles.create_container}>
        <h1>소셜다이닝 개최하기</h1>
        <div>
          <h2>제목</h2>
          <input type="text" className={styles.input} />
        </div>
        <div className={styles.half_container_wrap}>
          <div className={styles.input2_container}>
            <h2>위치</h2>
            <input type="text" className={styles.input_2} />
          </div>
          <div className={styles.input2_container}>
            <h2>날짜</h2>
            <input type="text" className={styles.input_2} />
          </div>
        </div>
        <div>
          <h2>음식 태그</h2>
        </div>
        <div>
          <div className={styles.h2_wrap}>
            <h2>평균 가격</h2>
            <h2>{price}원</h2>
          </div>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={100000}
            step={100}
            value={price}
            onChange={(event) => {
              setPrice(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <div className={styles.h2_wrap}>
            <h2>나이</h2>
            <h2>{age}세</h2>
          </div>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={100}
            step={1}
            value={age}
            onChange={(event) => {
              setAge(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <h2>인원</h2>
        </div>
        <div>
          <h2>카테고리</h2>
        </div>
        <div>
          <h2>성별</h2>
        </div>
        <div>
          <h2>설명</h2>
        </div>
      </div>
    </div>
  );
}
