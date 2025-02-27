"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { RangeSlider } from "@/components/multi-range-slider/multi-range-slider";
import DatePickerComponent from "@/components/date-picker/date-picker";
import Postcode from "@/components/postcode/postcode";
import Tag from "@/components/tag/tag";
import ImageUpload from "@/components/image-upload/image-upload";

export default function Create() {
  const [price, setPrice] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const [people, setPeople] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [selectedFoodTag, setSelectedFoodTag] = useState<string>("");
  const [selectedGenderTag, setSelectedGenderTag] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const foodTags = ["한식", "중식", "일식", "양식"]; // 태그 목록 정의
  const genderTags = ["남자", "여자"]; // 태그 목록 정의

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
            <Postcode
              onComplete={(address) => {
                setLocation(address);
                console.log(location);
              }}
            />
          </div>
          <div className={styles.input2_container}>
            <h2>날짜</h2>
            <DatePickerComponent
              value={selectedDate}
              onChange={(newValue: Date | null) => setSelectedDate(newValue)}
            />
          </div>
        </div>
        <div>
          <h2>음식 태그</h2>
          <Tag
            tags={foodTags}
            onSelect={(tag) => {
              setSelectedFoodTag(tag);
            }}
          />
        </div>
        <div>
          <div className={styles.h2_wrap}>
            <h2>평균 가격</h2>
            <input
              type="text"
              className={styles.none_input}
              value={price}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  if (value > 100000) {
                    setPrice(100000);
                  } else if (value < 0) {
                    setPrice(0);
                  } else {
                    setPrice(value);
                  }
                }
              }}
            />
            {price === 100000 ? <h2>＋&nbsp;원</h2> : <h2>&nbsp;원</h2>}
          </div>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={100000}
            step={500}
            value={price}
            onChange={(event) => {
              setPrice(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <div className={styles.h2_wrap}>
            <h2>인원</h2>
            <input
              type="text"
              className={styles.none_input}
              value={people}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  if (value > 20) {
                    setPeople(20);
                  } else if (value < 0) {
                    setPeople(0);
                  } else {
                    setPeople(value);
                  }
                }
              }}
            />
            {people === 20 ? <h2>＋&nbsp;명</h2> : <h2>&nbsp;명</h2>}
          </div>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={20}
            step={1}
            value={people}
            onChange={(event) => {
              setPeople(Number(event.target.value));
            }}
          />
        </div>
        <div>
          <div className={styles.h2_wrap}>
            <h2>나이</h2>
            {maxAge === 100 ? (
              <h2>{minAge} ~ 100+ 세</h2>
            ) : (
              <h2>
                {minAge} ~ {maxAge} 세
              </h2>
            )}
          </div>
          <RangeSlider
            min={0}
            max={100}
            onChange={(values) => {
              setMinAge(values.min);
              setMaxAge(values.max);
            }}
          />
        </div>
        <div>
          <h2>카테고리</h2>
        </div>
        <div>
          <h2>성별</h2>
          <Tag
            tags={genderTags}
            onSelect={(tag) => {
              setSelectedGenderTag(tag);
            }}
          />
        </div>
        <div>
          <h2>설명</h2>
          <textarea className={styles.textarea} />
        </div>
        <div>
          <h2>첨부 이미지</h2>
          <ImageUpload onImageSelect={(files) => setSelectedFiles(files)} />
        </div>
        <div className={styles.button_container}>
          <button className={styles.button + " " + styles.cancel}>취소</button>
          <button className={styles.button}>등록</button>
        </div>
      </div>
    </div>
  );
}
