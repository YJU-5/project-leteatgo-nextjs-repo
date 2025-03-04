"use client"; // Next.js에서 클라이언트 컴포넌트임을 명시

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MultiRangeSlider.module.css";

// 컴포넌트 props 타입 정의
interface RangeSliderProps {
  min: number; // 최소값
  max: number; // 최대값
  onChange?: (values: { min: number; max: number }) => void; // 값 변경 시 호출될 콜백
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  onChange,
}) => {
  // 왼쪽과 오른쪽 슬라이더의 현재 값을 상태로 관리
  const [leftValue, setLeftValue] = useState(min);
  const [rightValue, setRightValue] = useState(max);

  // 선택된 범위를 표시하는 div에 대한 참조
  const rangeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 선택된 범위의 스타일을 업데이트하는 함수
  const updateRangeStyle = useCallback(() => {
    if (rangeRef.current && containerRef.current) {
      const thumbSize = 44; // thumb의 크기 (px)
      const extraWidth = 10; // 추가할 너비 (px)
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = containerWidth - thumbSize;

      // 실제 이동 가능한 영역 내에서의 백분율 계산
      const leftPercent =
        ((((leftValue - min) / (max - min)) * trackWidth) / containerWidth) *
        100;
      const rightPercent =
        ((((rightValue - min) / (max - min)) * trackWidth) / containerWidth) *
        100;

      // thumb의 반크기만큼 오프셋 추가
      const thumbOffset = (thumbSize / 2 / containerWidth) * 100;
      const extraWidthPercent = (extraWidth / containerWidth) * 100; // 추가 너비를 백분율로 변환

      rangeRef.current.style.left = `${
        leftPercent + thumbOffset - extraWidthPercent / 2
      }%`;
      rangeRef.current.style.width = `${
        rightPercent - leftPercent + extraWidthPercent
      }%`;
    }
  }, [leftValue, rightValue, min, max]);

  // 왼쪽 슬라이더 값 변경 핸들러
  const handleLeftInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // 오른쪽 값보다 작은 값만 허용
      const value = Math.min(parseInt(e.target.value), rightValue - 1);
      setLeftValue(value);
    },
    [rightValue]
  );

  // 오른쪽 슬라이더 값 변경 핸들러
  const handleRightInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // 왼쪽 값보다 큰 값만 허용
      const value = Math.max(parseInt(e.target.value), leftValue + 1);
      setRightValue(value);
    },
    [leftValue]
  );

  // 값이 변경될 때마다 범위 스타일 업데이트 및 onChange 콜백 호출
  useEffect(() => {
    updateRangeStyle();
    onChange?.({ min: leftValue, max: rightValue });
  }, [leftValue, rightValue, onChange, updateRangeStyle]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.slider}>
        <div className={styles.track} /> {/* 슬라이더 배경 트랙 */}
        <div className={styles.range} ref={rangeRef} /> {/* 선택된 범위 표시 */}
      </div>
      {/* 왼쪽 슬라이더 input */}
      <input
        type="range"
        className={`${styles.thumb} ${styles.thumbLeft}`}
        min={min}
        max={max}
        value={leftValue}
        onChange={handleLeftInput}
      />
      <p className={styles.minAgeText}>{min}</p> {/* 최소값 표시 */}
      {/* 오른쪽 슬라이더 input */}
      <input
        type="range"
        className={`${styles.thumb} ${styles.thumbRight}`}
        min={min}
        max={max}
        value={rightValue}
        onChange={handleRightInput}
      />
      <p className={styles.maxAgeText}>{max}</p> {/* 최대값 표시 */}
    </div>
  );
};
