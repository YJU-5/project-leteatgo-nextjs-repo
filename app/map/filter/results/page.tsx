"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  currentParticipants?: number;
  distance?: number;
  category?: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 35.95,
    longitude: 128.46,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("위치 권한 에러:", error);
      }
    );
  }, []);

  useEffect(() => {
    const fetchFilteredRooms = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const params = new URLSearchParams({
          latitude: currentLocation.latitude.toString(),
          longitude: currentLocation.longitude.toString(),
          minDistance: searchParams.get("minDistance") || "0",
          maxDistance: searchParams.get("maxDistance") || "10",
          minPrice: searchParams.get("minPrice") || "10000",
          maxPrice: searchParams.get("maxPrice") || "100000",
          minAge: searchParams.get("minAge") || "20",
          maxAge: searchParams.get("maxAge") || "50",
          categories: searchParams.get("categories") || "",
        });

        // 기존 map API를 사용하고 프론트엔드에서 필터링
        const response = await fetch(`${apiUrl}/api/chat-room/map?${params}`);
        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          // 프론트엔드에서 필터링 수행
          const filtered = data.filter((room) => {
            const distance = room.distance || 0;
            const minDistance = Number(searchParams.get("minDistance")) || 0;
            const maxDistance = Number(searchParams.get("maxDistance")) || 10;
            if (distance < minDistance || distance > maxDistance) return false;

            const minPrice = Number(searchParams.get("minPrice")) || 10000;
            const maxPrice = Number(searchParams.get("maxPrice")) || 100000;
            if (room.averagePrice < minPrice || room.averagePrice > maxPrice)
              return false;

            const minAge = Number(searchParams.get("minAge")) || 20;
            const maxAge = Number(searchParams.get("maxAge")) || 50;
            if (room.minAge > maxAge || room.maxAge < minAge) return false;

            const categories =
              searchParams.get("categories")?.split(",").filter(Boolean) || [];
            if (
              categories.length > 0 &&
              room.category &&
              !categories.includes(room.category)
            ) {
              return false;
            }

            return true;
          });

          setChatRooms(filtered);
        }
      } catch (err) {
        console.error("API 요청 실패:", err);
      }
    };

    fetchFilteredRooms();
  }, [currentLocation, searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>검색한 소셜다이닝</h1>

      <div className={styles.resultGrid}>
        {chatRooms.map((room) => (
          <div key={room.id} className={styles.resultCard}>
            <img
              src={room.pictureUrl || "/restaurant.jpg"}
              alt={room.title}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{room.title}</h3>
              <p className={styles.cardLocation}>📍 {room.address}</p>
              <p className={styles.cardDate}>🗓 {formatDate(room.startDate)}</p>
              <div className={styles.cardTags}>
                <span className={styles.tag}>{room.category || "한식"}</span>
                <span className={styles.tag}>요리 교실</span>
                <span className={styles.tag}>
                  💰 {room.averagePrice.toLocaleString()}원
                </span>
                <span className={styles.tag}>
                  {room.maxParticipants - (room.currentParticipants || 0)}명
                  참여 가능
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
