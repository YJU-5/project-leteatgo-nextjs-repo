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
    const fetchFilteredChatRooms = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const params = new URLSearchParams();
        const minAge = searchParams.get("minAge");
        const maxAge = searchParams.get("maxAge");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const categories = searchParams.get("categories");
        const gender = searchParams.get("gender");
        const status = searchParams.get("status");

        if (minAge && !isNaN(Number(minAge))) params.append("minAge", minAge);
        if (maxAge && !isNaN(Number(maxAge))) params.append("maxAge", maxAge);
        if (minPrice && !isNaN(Number(minPrice)))
          params.append("minPrice", minPrice);
        if (maxPrice && !isNaN(Number(maxPrice)))
          params.append("maxPrice", maxPrice);
        if (categories && categories !== "")
          params.append("categories", categories);
        if (gender && gender !== "") params.append("gender", gender);
        if (status && status !== "") params.append("status", status);

        const url = params.toString()
          ? `${apiUrl}/chat-room/filter?${params}`
          : `${apiUrl}/chat-room/filter`;

        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        if (Array.isArray(data)) {
          const processedData = data.map((room) => ({
            ...room,
            title: room.title || "제목 없음",
            address: room.address || "주소 없음",
            startDate: room.startDate || null,
            averagePrice: room.averagePrice || 0,
            maxParticipants: room.maxParticipants || 0,
            category: room.category || "기타",
          }));
          setChatRooms(processedData);
        } else {
          console.error("Unexpected API response format:", data);
          setChatRooms([]);
        }
      } catch (error) {
        console.error("Failed to fetch filtered chat rooms:", error);
        setChatRooms([]);
      }
    };

    if (currentLocation) {
      fetchFilteredChatRooms();
    }
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
        {chatRooms.length === 0 ? (
          <div style={{ color: "#fff", textAlign: "center", width: "100%" }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          chatRooms.map((room) => (
            <div key={room.id} className={styles.resultCard}>
              <img
                src={room.pictureUrl || "/restaurant.jpg"}
                alt={room.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{room.title}</h3>
                <p className={styles.cardLocation}>📍 {room.address}</p>
                <p className={styles.cardDate}>
                  🗓 {room.startDate ? formatDate(room.startDate) : "날짜 미정"}
                </p>
                <div className={styles.cardTags}>
                  <span className={styles.tag}>{room.category}</span>
                  <span className={styles.tag}>
                    💰 {Number(room.averagePrice).toLocaleString()}원
                  </span>
                  <span className={styles.tag}>
                    {room.maxParticipants}명 참여 가능
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
