import React, { useState, useCallback } from "react";
import styles from "./ContentSlider.module.css";
import Image from "next/image";

interface Content {
  id: number;
  img: string;
  name: string;
  address: string;
  date: string;
  tag: string[];
  person: number;
}

interface ContentSliderProps {
  contents: Content[];
}

export default function ContentSlider({ contents }: ContentSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("next");
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= contents.length ? 0 : prevIndex + 3
    );
    setTimeout(() => setIsAnimating(false), 100);
  }, [isAnimating, contents.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("prev");
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 3;
      if (newIndex < 0) {
        const lastGroupStart = Math.floor((contents.length - 1) / 3) * 3;
        return lastGroupStart;
      }
      return newIndex;
    });
    setTimeout(() => setIsAnimating(false), 100);
  }, [isAnimating, contents.length]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(index * 3 > currentIndex ? "next" : "prev");
      setCurrentIndex(index * 3);
      setTimeout(() => setIsAnimating(false), 100);
    },
    [isAnimating, currentIndex]
  );

  const visibleContents = contents.slice(currentIndex, currentIndex + 3);

  return (
    <div className={styles.contentSliderContainer}>
      <div className={styles.sliderWrapper}>
        <button
          className={`${styles.sliderButton} ${styles.prevButton}`}
          onClick={handlePrev}
          aria-label="이전 내용"
          disabled={isAnimating}
        >
          左
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
                height={150}
                className={styles.sliderImage}
              />
              <div className={styles.contentInfo}>
                <h3 className={styles.contentName}>{content.name}</h3>
                <p className={styles.contentAddress}>{content.address}</p>
                <p className={styles.contentDate}>{content.date}</p>
                <p className={styles.contentTag}>
                  {content.tag.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </p>
                <p className={styles.contentPerson}>인원: {content.person}</p>
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
          右
        </button>
      </div>
      <div className={styles.dotsContainer}>
        {Array.from({ length: Math.ceil(contents.length / 3) }).map(
          (_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                Math.floor(currentIndex / 3) === index ? styles.activeDot : ""
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
