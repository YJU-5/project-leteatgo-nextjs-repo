"use client";

import styles from "./page.module.css";
import { useState, useCallback, memo } from "react";
import { RangeSlider } from "@/components/MultiRangeSlider/MultiRangeSlider";
import DatePickerComponent from "@/components/DatePicker/DatePicker";
import Postcode from "@/components/Postcode/Postcode";
import Tag from "@/components/Tag/Tag";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

interface Create {
  title: string;
  description: string;
  address: string;
  latitube: string;
  longitude: string;
  startDate: string;
  maxPrice: number;
  minPrice: number;
  gender: string;
  minAge: number;
  maxAge: number;
  maxParticipants: number;
  pictureUrl: string;
  // foodTag: string;
}

// 바뀔 수도 있는 값들은 따로 지정해줌.
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
  const jwtToken = useSelector((state: RootState) => state.user.jwtToken);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(MAX_AGE);
  const [people, setPeople] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState("");
  const [latitube, setLatitube] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedGenderTag, setSelectedGenderTag] = useState("");

  // 이벤트 핸들러 메모이제이션
  const handlePostcodeComplete = useCallback(
    (address: string, coordinates?: { lat: number; lng: number }) => {
      setAddress(address);
      setLatitube(coordinates?.lat.toString() || "");
      setLongitude(coordinates?.lng.toString() || "");
      console.log(address, coordinates);
    },
    []
  );

  const handleDateChange = useCallback((newValue: Date | null) => {
    setSelectedDate(newValue);
  }, []);

  const handleGenderTagSelect = useCallback((tag: string) => {
    const genderMap: { [key: string]: string } = {
      남자: "M",
      여자: "F",
      무관: "UNSPECIFIED",
    };
    setSelectedGenderTag(genderMap[tag] || "UNSPECIFIED");
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

      if (!selectedDate) {
        throw new Error("날짜를 선택해주세요.");
      }

      if (!jwtToken) {
        throw new Error("로그인이 필요합니다.");
      }

      // 날짜를 YYYY-MM-DD 형식으로 변환
      const formattedDate = selectedDate
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, "-")
        .replace(".", "");

      const formData = new FormData();

      // 기본 데이터 추가
      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("latitube", latitube);
      formData.append("longitude", longitude);
      formData.append("startDate", formattedDate);
      formData.append("maxPrice", String(price));
      formData.append("minPrice", String(price));
      formData.append("minAge", String(minAge));
      formData.append("maxAge", String(maxAge));
      formData.append("gender", selectedGenderTag);
      formData.append("maxParticipants", String(people));
      formData.append("pictureUrl", ""); // 빈 문자열로 초기화

      // 이미지 파일이 있는 경우 추가
      if (selectedFiles.length > 0) {
        formData.append("pictureUrl", selectedFiles[0]);
      }

      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL); // API URL 확인용
      console.log("전송할 데이터:", Object.fromEntries(formData)); // 디버깅용

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-room`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
          },
          body: formData,
          credentials: "include",
          mode: "cors",
        }
      );

      // 204 응답 처리
      if (response.status === 204) {
        throw new Error(
          "서버가 응답을 처리하지 못했습니다. 다시 시도해주세요."
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `서버 오류: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.id) {
        throw new Error("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
      }

      router.push(`/chat/${data.id}`);
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setError(
            "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
          );
        } else if (error.message.includes("NetworkError")) {
          setError(
            "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요."
          );
        } else {
          setError(error.message);
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
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
          {/* <MemoizedTag tags={FOOD_TAGS} onSelect={handleFoodTagSelect} /> */}
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
