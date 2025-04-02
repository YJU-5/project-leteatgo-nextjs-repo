"use client";

import styles from "./page.module.css";
import { useState, useCallback, memo } from "react";
import { RangeSlider } from "@/components/MultiRangeSlider/MultiRangeSlider";
import DatePickerComponent from "@/components/DatePicker/DatePicker";
import Postcode from "@/components/Postcode/Postcode";
import Tag from "@/components/Tag/Tag";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useRouter } from "next/navigation";

interface Create {
  title: string;
  location: string;
  date: string;
  foodTag: string;
  price: number;
}

// 바뀔 수도 있는 값들은 따로 지정해줌.
const FOOD_TAGS = ["한식", "중식", "일식", "양식"];
const GENDER_TAGS = ["남자", "여자", "무관"];
const MAX_PRICE = 100000;
const MAX_PEOPLE = 20;
const MAX_AGE = 100;

// 메모이제이션된 하위 컴포넌트들
const MemoizedDatePicker = memo(DatePickerComponent);
const MemoizedPostcode = memo(Postcode);
const MemoizedTag = memo(Tag);
const MemoizedImageUpload = memo(ImageUpload);

export default function Create() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(MAX_AGE);
  const [people, setPeople] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [selectedFoodTag, setSelectedFoodTag] = useState<string>("");
  const [selectedGenderTag, setSelectedGenderTag] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이벤트 핸들러 메모이제이션
  const handlePostcodeComplete = useCallback(
    (address: string, coordinates?: { lat: number; lng: number }) => {
      setLocation(address);
      console.log(address, coordinates);
    },
    []
  );

  const handleDateChange = useCallback((newValue: Date | null) => {
    setSelectedDate(newValue);
  }, []);

  const handleFoodTagSelect = useCallback((tag: string) => {
    setSelectedFoodTag(tag);
  }, []);

  const handleGenderTagSelect = useCallback((tag: string) => {
    setSelectedGenderTag(tag);
  }, []);

  const handlePriceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (!isNaN(value)) {
        setPrice(Math.max(0, Math.min(value, MAX_PRICE)));
      }
    },
    []
  );

  const handlePeopleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (!isNaN(value)) {
        setPeople(Math.max(0, Math.min(value, MAX_PEOPLE)));
      }
    },
    []
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 채팅방 생성을 위한 데이터 구성
      const chatRoomData = {
        title: title,
        location: location,
        date: selectedDate,
        foodTag: selectedFoodTag,
        price: price,
        maxPeople: people,
        minAge: minAge,
        maxAge: maxAge,
        gender: selectedGenderTag,
        description: description,
        images: selectedFiles,
      };

      // FormData 생성
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
      Object.entries(chatRoomData).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, String(value));
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-room`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "채팅방 생성에 실패했습니다.");
      }

      const data = await response.json();
      router.push(`/chat/${data.id}`);
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      setError(
        error instanceof Error ? error.message : "서버 연결에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.create}>
      <div className={styles.createContainer}>
        <h1 className={styles.upContent}>소셜다이닝 개최하기</h1>
        <div className={`${styles.upContent} ${styles.delay1}`}>
          <h2>제목</h2>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div
          className={`${styles.halfContainerWrap} ${styles.upContent} ${styles.delay2}`}
        >
          <div className={styles.input2Container}>
            <h2>위치</h2>
            <MemoizedPostcode onComplete={handlePostcodeComplete} />
          </div>
          <div className={styles.input2Container}>
            <h2>날짜</h2>
            <MemoizedDatePicker
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className={`${styles.upContent} ${styles.delay3}`}>
          <h2>음식 태그</h2>
          <MemoizedTag tags={FOOD_TAGS} onSelect={handleFoodTagSelect} />
        </div>
        <div className={`${styles.upContent} ${styles.delay4}`}>
          <div className={styles.h2Wrap}>
            <h2>평균 가격</h2>
            <input
              type="text"
              className={styles.noneInput}
              value={price}
              onChange={handlePriceChange}
            />
            {price === MAX_PRICE ? <h2>＋&nbsp;원</h2> : <h2>&nbsp;원</h2>}
          </div>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={MAX_PRICE}
            step={500}
            value={price}
            onChange={handlePriceChange}
          />
        </div>
        <div className={`${styles.upContent} ${styles.delay5}`}>
          <div className={styles.h2Wrap}>
            <h2>인원</h2>
            <input
              type="text"
              className={styles.noneInput}
              value={people}
              onChange={handlePeopleChange}
            />
            {people === MAX_PEOPLE ? <h2>＋&nbsp;명</h2> : <h2>&nbsp;명</h2>}
          </div>
          <input
            className={styles.slider}
            type="range"
            min={0}
            max={MAX_PEOPLE}
            step={1}
            value={people}
            onChange={handlePeopleChange}
          />
        </div>
        <div className={`${styles.upContent} ${styles.delay6}`}>
          <div className={styles.h2Wrap}>
            <h2>나이</h2>
            {maxAge === MAX_AGE ? (
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
        <div className={`${styles.upContent} ${styles.delay7}`}>
          <h2>카테고리</h2>
        </div>
        <div className={`${styles.upContent} ${styles.delay8}`}>
          <h2>성별</h2>
          <MemoizedTag tags={GENDER_TAGS} onSelect={handleGenderTagSelect} />
        </div>
        <div className={`${styles.upContent} ${styles.delay9}`}>
          <h2>설명</h2>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={`${styles.upContent} ${styles.delay10}`}>
          <h2>첨부 이미지</h2>
          <MemoizedImageUpload
            onImageSelect={(files) => setSelectedFiles(files)}
          />
        </div>
        <div className={styles.buttonContainer}>
          {error && <div className={styles.error}>{error}</div>}
          <button
            className={styles.button + " " + styles.cancel}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
