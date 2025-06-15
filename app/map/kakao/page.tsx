"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

interface ChatRoom {
  id: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  averagePrice: number;
  maxParticipants: number;
  currentParticipants?: number;
  pictureUrl?: string;
  category?: string;
  startDate?: string;
}

export default function KakaoMapPage() {
  const searchParams = useSearchParams();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 35.95,
    longitude: 128.46,
  });
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const fetchChatRooms = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const params = new URLSearchParams({
          latitude: String(currentLocation.latitude),
          longitude: String(currentLocation.longitude),
          ...(searchParams.get("minDistance") && {
            minDistance: searchParams.get("minDistance"),
          }),
          ...(searchParams.get("maxDistance") && {
            maxDistance: searchParams.get("maxDistance"),
          }),
          ...(searchParams.get("minPrice") && {
            minPrice: searchParams.get("minPrice"),
          }),
          ...(searchParams.get("maxPrice") && {
            maxPrice: searchParams.get("maxPrice"),
          }),
          ...(searchParams.get("minAge") && {
            minAge: searchParams.get("minAge"),
          }),
          ...(searchParams.get("maxAge") && {
            maxAge: searchParams.get("maxAge"),
          }),
          ...(searchParams.get("categories") && {
            category: searchParams.get("categories"),
          }),
          ...(searchParams.get("maxParticipants") && {
            maxParticipants: searchParams.get("maxParticipants"),
          }),
        }).toString();

        const accessToken = localStorage.getItem("accessToken");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await fetch(`${apiUrl}/chat-room/map?${params}`, {
          credentials: "include",
          headers,
        });

        if (!response.ok) {
          console.error("Server response:", await response.text());
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched chat rooms:", data);
        setChatRooms(data);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setError("채팅방 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchChatRooms();
  }, [currentLocation, searchParams]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <Map
        center={{
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        }}
        className={styles.map}
        level={5}
      >
        {/* 현재 위치 마커 */}
        <MapMarker
          position={{
            lat: currentLocation.latitude,
            lng: currentLocation.longitude,
          }}
          image={{
            src: "/location.png",
            size: { width: 36, height: 36 },
            options: { offset: { x: 18, y: 36 } },
          }}
          onMouseOver={() => setHoveredMarkerId("current")}
          onMouseOut={() => setHoveredMarkerId(null)}
        >
          {hoveredMarkerId === "current" && (
            <div className={styles["current-location-tooltip"]}>
              <span className={styles["current-location-text"]}>현재 위치</span>
            </div>
          )}
        </MapMarker>

        {/* 채팅방 마커들 */}
        {chatRooms.map((room) => (
          <MapMarker
            key={room.id}
            position={{ lat: room.latitude, lng: room.longitude }}
            onMouseOver={() => setHoveredMarkerId(room.id)}
            onMouseOut={() => setHoveredMarkerId(null)}
            onClick={() => setSelectedRoom(room)}
          >
            {hoveredMarkerId === room.id && (
              <div className={styles["tooltip-container"]}>
                <div
                  className={styles["tooltip-image"]}
                  style={{
                    backgroundImage: `url(${
                      room.pictureUrl || "/restaurant.jpg"
                    })`,
                  }}
                />
                <div className={styles["tooltip-content"]}>
                  <h3 className={styles["tooltip-title"]}>{room.title}</h3>
                  <p className={styles["tooltip-address"]}>📍 {room.address}</p>
                  <p className={styles["tooltip-date"]}>
                    📅 {formatDate(room.startDate)}
                  </p>
                  <div className={styles["tooltip-tags"]}>
                    <span className={styles["tooltip-tag"]}>
                      {room.category || "한식"}
                    </span>
                    <span className={styles["tooltip-tag"]}>
                      {room.maxParticipants - (room.currentParticipants || 0)}명
                      참여 가능
                    </span>
                  </div>
                  <p className={styles["tooltip-participants"]}>
                    참가 가능 인원:{" "}
                    {room.maxParticipants - (room.currentParticipants || 0)}명
                  </p>
                </div>
              </div>
            )}
          </MapMarker>
        ))}
      </Map>

      {/* 모달 */}
      {selectedRoom && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={styles["modal-header-image"]}
              style={{
                backgroundImage: `url(${
                  selectedRoom.pictureUrl || "/restaurant.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <button
              className={styles["close-button"]}
              onClick={() => setSelectedRoom(null)}
            >
              ✕
            </button>
            <div className={styles["modal-info"]}>
              <h2 className={styles["modal-title"]}>
                {selectedRoom.title}
                <span className={styles.host}>호스트: 김철수</span>
              </h2>
              <div className={styles["modal-metadata"]}>
                <div className={styles.date}>
                  📅 {formatDate(selectedRoom.startDate)}
                </div>
                <div className={styles.location}>📍 {selectedRoom.address}</div>
              </div>
              <p className={styles.description}>{selectedRoom.description}</p>
              <div className={styles.tags}>
                <span className={styles.tag}>
                  {selectedRoom.category || "한식"}
                </span>
                <span className={styles.tag}>
                  {selectedRoom.maxParticipants -
                    (selectedRoom.currentParticipants || 0)}
                  명 참여 가능
                </span>
              </div>
              <button className={styles["join-button"]}>참여하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
