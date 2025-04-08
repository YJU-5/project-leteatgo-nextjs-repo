import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "./ContentSlider.module.css";
import Image from "next/image";
import Description from "../Description/Description";

interface Host {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  birthday: string | null;
  gender: string | null;
  pictureUrl: string;
  description: string | null;
  role: string;
  socialProvider: string;
  socialId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface Content {
  id: number; // 아이디
  title: string; // 제목
  description: string; // 설명
  pictureUrl: string; // 이미지
  profileImg: string; // 프로필 이미지
  username: string; // 유저 이름
  name: string; // 이름
  address: string; // 주소
  startDate: string; // 시작일
  // tag?: string[];
  maxParticipants: number; // 최대 참여자 수
  gender: string; // 성별
  minAge: number; // 최소 나이
  maxAge: number; // 최대 나이
  latitude: string; // 위도
  longitude: string; // 경도
  price: number; // 가격
  createdAt: string; // 생성일
  isActive: number; // 활성화 여부
  hostId: Host; // 호스트 아이디
}
interface ContentSliderProps {
  contents: Content[];
  link: boolean;
}

export default function ContentSlider({
  contents = [],
  link,
}: ContentSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const defaultImage = "/foods/kr-food.jpg";

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1500 ? 4 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimating || !containerRef.current) return;
    setIsAnimating(true);
    setDirection("next");
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= contents.length ? 0 : prevIndex + itemsPerPage
    );
    setTimeout(() => setIsAnimating(false), 100);
  }, [isAnimating, contents.length, itemsPerPage]);

  const handlePrev = useCallback(() => {
    if (isAnimating || !containerRef.current) return;
    setIsAnimating(true);
    setDirection("prev");
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - itemsPerPage;
      if (newIndex < 0) {
        const lastGroupStart =
          Math.floor((contents.length - 1) / itemsPerPage) * itemsPerPage;
        return lastGroupStart;
      }
      return newIndex;
    });
    setTimeout(() => setIsAnimating(false), 100);
  }, [isAnimating, contents.length, itemsPerPage]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(index * itemsPerPage > currentIndex ? "next" : "prev");
      setCurrentIndex(index * itemsPerPage);
      setTimeout(() => setIsAnimating(false), 100);
    },
    [isAnimating, currentIndex, itemsPerPage]
  );

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
  };

  const visibleContents = Array.isArray(contents)
    ? contents.slice(currentIndex, currentIndex + itemsPerPage)
    : [];

  if (!Array.isArray(contents) || contents.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>
          현재 진행 중인 소셜 다이닝이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.contentSliderContainer} ref={containerRef}>
      {selectedContent && (
        <Description
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          link={link}
        />
      )}
      <div className={styles.sliderWrapper}>
        <button
          className={`${styles.sliderButton} ${styles.prevButton}`}
          onClick={handlePrev}
          aria-label="이전 내용"
          disabled={isAnimating}
        >
          <Image src="/arrowLeft.png" alt="이전 내용" width={20} height={20} />
        </button>
        <div
          className={`${styles.imageContainer} ${
            isAnimating
              ? direction === "next"
                ? styles.slidingNext
                : styles.slidingPrev
              : ""
          }`}
        >
          {visibleContents.map((content) => (
            <div
              key={content.id}
              className={styles.imageWrapper}
              onClick={() => handleContentClick(content)}
            >
              <Image
                src={content.pictureUrl || defaultImage}
                alt={content.title}
                width={300}
                height={150}
                className={styles.sliderImage}
              />
              <div className={styles.contentInfo}>
                <h3 className={styles.contentName}>{content.title}</h3>
                {content.hostId && (
                  <>
                    <Image
                      src={content.hostId.pictureUrl || defaultImage}
                      alt={`${content.hostId.name || "사용자"}의 프로필 이미지`}
                      width={20}
                      height={20}
                      className={styles.contentProfileImg}
                    />
                    <p className={styles.contentUsername}>
                      {content.hostId.name || "사용자"}
                    </p>
                  </>
                )}
                <p className={styles.contentAddress}>{content.address}</p>
                <p className={styles.contentDate}>{content.startDate}</p>
                <p className={styles.contentPerson}>
                  최대 인원: {content.maxParticipants}
                </p>
                <div className={styles.contentTag}>
                  <p className={styles.tag}>
                    {content.gender === "M"
                      ? "남자"
                      : content.gender === "F"
                      ? "여자"
                      : "무관"}
                  </p>
                  <p className={styles.tag}>
                    {content.minAge}~{content.maxAge}대
                  </p>
                  <p className={styles.tag}>{content.price}원</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className={`${styles.sliderButton} ${styles.nextButton}`}
          onClick={handleNext}
          aria-label="다음 내용"
          disabled={isAnimating}
        >
          <Image src="/arrowRight.png" alt="다음 내용" width={20} height={20} />
        </button>
      </div>
      <div className={styles.dotsContainer}>
        {Array.from({ length: Math.ceil(contents.length / itemsPerPage) }).map(
          (_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                Math.floor(currentIndex / itemsPerPage) === index
                  ? styles.activeDot
                  : ""
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`${index + 1}번 그룹으로 이동`}
              disabled={isAnimating}
            />
          )
        )}
      </div>
    </div>
  );
}
