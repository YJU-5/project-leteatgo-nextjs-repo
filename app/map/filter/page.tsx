"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface ChatRoom {
  id: string;
  title: string;
  description: string;
  status: "IN_PROGRESS" | "COMPLETED";
  startDate: string;
  maxParticipants: number;
  gender: "M" | "F" | "UNSPECIFIED";
  pictureUrl?: string;
  minAge: number;
  maxAge: number;
  latitude: number;
  longitude: number;
  address: string;
  averagePrice: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  hostId: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    birthday: string;
    gender: string;
    pictureUrl?: string;
    description?: string;
    role: string;
    socialProvider: string;
    socialId: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
  };
  currentParticipants?: number;
  distance?: number;
  category?: string;
}

interface FilterState {
  distance: [number, number];
  price: [number, number];
  age: [number, number];
  categories: string[];
}

export default function FilterPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    distance: [0, 10],
    price: [10000, 100000],
    age: [28, 35],
    categories: [],
  });

  const categories = ["한식", "일식", "중식", "양식"];

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleRangeChange = (
    type: "distance" | "price" | "age",
    index: 0 | 1,
    value: number
  ) => {
    setFilters((prev) => {
      const newValue = Number(value);
      const [min, max] = prev[type];

      if (index === 0) {
        return {
          ...prev,
          [type]: [Math.min(newValue, max - 1), max],
        };
      } else {
        return {
          ...prev,
          [type]: [min, Math.max(newValue, min + 1)],
        };
      }
    });
  };

  const handleConfirm = () => {
    const params = new URLSearchParams({
      minDistance: filters.distance[0].toString(),
      maxDistance: filters.distance[1].toString(),
      minPrice: filters.price[0].toString(),
      maxPrice: filters.price[1].toString(),
      minAge: filters.age[0].toString(),
      maxAge: filters.age[1].toString(),
      categories: filters.categories.join(","),
    });

    router.push(`/map/filter/results?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({
      distance: [0, 10],
      price: [10000, 100000],
      age: [28, 35],
      categories: [],
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>검색한 소셜다이닝</h1>

      <div className={styles.filterSection}>
        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>거리</span>
          <div className={styles.rangeContainer}>
            <div
              className={styles.rangeSlider}
              style={
                {
                  "--range-min": `${
                    ((filters.distance[0] - 0) / (10 - 0)) * 100
                  }%`,
                  "--range-max": `${
                    ((filters.distance[1] - 0) / (10 - 0)) * 100
                  }%`,
                } as React.CSSProperties
              }
            >
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={filters.distance[0]}
                onChange={(e) =>
                  handleRangeChange("distance", 0, Number(e.target.value))
                }
              />
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={filters.distance[1]}
                onChange={(e) =>
                  handleRangeChange("distance", 1, Number(e.target.value))
                }
              />
            </div>
          </div>
          <div className={styles.rangeValues}>
            <span>{filters.distance[0]}km</span>
            <span>{filters.distance[1]}km</span>
          </div>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>가격</span>
          <div className={styles.rangeContainer}>
            <div
              className={styles.rangeSlider}
              style={
                {
                  "--range-min": `${
                    ((filters.price[0] - 10000) / (100000 - 10000)) * 100
                  }%`,
                  "--range-max": `${
                    ((filters.price[1] - 10000) / (100000 - 10000)) * 100
                  }%`,
                } as React.CSSProperties
              }
            >
              <input
                type="range"
                min={10000}
                max={100000}
                step={1000}
                value={filters.price[0]}
                onChange={(e) =>
                  handleRangeChange("price", 0, Number(e.target.value))
                }
              />
              <input
                type="range"
                min={10000}
                max={100000}
                step={1000}
                value={filters.price[1]}
                onChange={(e) =>
                  handleRangeChange("price", 1, Number(e.target.value))
                }
              />
            </div>
          </div>
          <div className={styles.rangeValues}>
            <span>{filters.price[0].toLocaleString()}원</span>
            <span>{filters.price[1].toLocaleString()}원</span>
          </div>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>나이</span>
          <div className={styles.rangeContainer}>
            <div
              className={styles.rangeSlider}
              style={
                {
                  "--range-min": `${
                    ((filters.age[0] - 20) / (50 - 20)) * 100
                  }%`,
                  "--range-max": `${
                    ((filters.age[1] - 20) / (50 - 20)) * 100
                  }%`,
                } as React.CSSProperties
              }
            >
              <input
                type="range"
                min={20}
                max={50}
                value={filters.age[0]}
                onChange={(e) =>
                  handleRangeChange("age", 0, Number(e.target.value))
                }
              />
              <input
                type="range"
                min={20}
                max={50}
                value={filters.age[1]}
                onChange={(e) =>
                  handleRangeChange("age", 1, Number(e.target.value))
                }
              />
            </div>
          </div>
          <div className={styles.rangeValues}>
            <span>{filters.age[0]}세</span>
            <span>{filters.age[1]}세</span>
          </div>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>태그</span>
          <div className={styles.tagContainer}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.tag} ${
                  filters.categories.includes(category) ? styles.active : ""
                }`}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          찾기
        </button>
        <button className={styles.resetButton} onClick={resetFilters}>
          초기화
        </button>
      </div>
    </div>
  );
}
