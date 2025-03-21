import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "./ImageSlider.module.css";
import Image from "next/image";

interface Content {
  id: number;
  img: string;
  name: string;
  comment: string;
}

interface ImageSliderProps {
  contents: Content[];
}

export default function ImageSlider({ contents }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1500 ? 4 : 3);
    };

    handleResize(); // 초기 설정
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
      if (isAnimating || !containerRef.current) return;
      setIsAnimating(true);
      setDirection(index * itemsPerPage > currentIndex ? "next" : "prev");
      setCurrentIndex(index * itemsPerPage);
      setTimeout(() => setIsAnimating(false), 100);
    },
    [isAnimating, currentIndex, itemsPerPage]
  );

  const visibleContents = contents.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <div className={styles.imageSliderContainer} ref={containerRef}>
      <div className={styles.sliderWrapper}>
        <button
          className={`${styles.sliderButton} ${styles.prevButton}`}
          onClick={handlePrev}
          aria-label="이전 이미지"
          disabled={isAnimating}
        >
          <Image
            src="/arrowLeft.png"
            alt="이전 이미지"
            width={20}
            height={20}
          />
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
            <div key={content.id} className={styles.imageWrapper}>
              <Image
                src={content.img}
                alt={`${content.name}의 이미지`}
                width={300}
                height={200}
                className={styles.sliderImage}
              />
              <div className={styles.contentInfo}>
                <h3 className={styles.userName}>{content.name}</h3>
                <p className={styles.userComment}>{content.comment}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className={`${styles.sliderButton} ${styles.nextButton}`}
          onClick={handleNext}
          aria-label="다음 이미지"
          disabled={isAnimating}
        >
          <Image
            src="/arrowRight.png"
            alt="다음 이미지"
            width={20}
            height={20}
          />
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
