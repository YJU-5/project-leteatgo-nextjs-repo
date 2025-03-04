import React, { useState, useCallback } from "react";
import styles from "./ImageSlider.module.css";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("next");
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= images.length ? 0 : prevIndex + 3
    );
    setTimeout(() => setIsAnimating(false), 100);
  }, [isAnimating, images.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection("prev");
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(0, images.length - 3) : prevIndex - 3
    );
    setTimeout(() => setIsAnimating(false), 100);
  }, [isAnimating, images.length]);

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

  const visibleImages = images.slice(currentIndex, currentIndex + 3);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        <button
          className={`${styles.sliderButton} ${styles.prevButton}`}
          onClick={handlePrev}
          aria-label="이전 이미지"
          disabled={isAnimating}
        >
          ←
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
          {visibleImages.map((image, index) => (
            <div
              key={`${currentIndex}-${index}`}
              className={styles.imageWrapper}
            >
              <Image
                src={image}
                alt={`슬라이드 ${currentIndex + index + 1}`}
                width={300}
                height={200}
                className={styles.sliderImage}
              />
            </div>
          ))}
        </div>
        <button
          className={`${styles.sliderButton} ${styles.nextButton}`}
          onClick={handleNext}
          aria-label="다음 이미지"
          disabled={isAnimating}
        >
          →
        </button>
      </div>
      <div className={styles.dotsContainer}>
        {Array.from({ length: Math.ceil(images.length / 3) }).map(
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
