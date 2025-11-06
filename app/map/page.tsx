"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { getAllChatRooms } from "./api/chat-room";
import type { ChatRoom } from "./types/chat-room";
import styles from "./page.module.css";

// 더미 데이터 (대구광역시 북구 지역 기준)
const DUMMY_CHAT_ROOMS: ChatRoom[] = [
  {
    id: "dummy-1",
    title: "맛있는 한식당",
    description: "정성스럽게 만든 한식 요리를 함께 즐겨요",
    address: "대구광역시 북구 대학로 80",
    latitude: 35.896,
    longitude: 128.614,
    averagePrice: 15000,
    maxParticipants: 4,
    currentParticipants: 2,
    pictureUrl: "/restaurant.jpg",
    category: "한식",
    startDate: "2025-01-20",
  },
  {
    id: "dummy-2",
    title: "이탈리안 파스타",
    description: "맛있는 파스타와 피자를 함께 먹어요",
    address: "대구광역시 북구 대학로 120",
    latitude: 35.902,
    longitude: 128.618,
    averagePrice: 20000,
    maxParticipants: 6,
    currentParticipants: 3,
    pictureUrl: "/restaurant.jpg",
    category: "양식",
    startDate: "2025-01-21",
  },
  {
    id: "dummy-3",
    title: "일본식 돈까스",
    description: "바삭한 돈까스를 함께 먹어요",
    address: "대구광역시 북구 복현동 123",
    latitude: 35.888,
    longitude: 128.608,
    averagePrice: 12000,
    maxParticipants: 4,
    currentParticipants: 1,
    pictureUrl: "/restaurant.jpg",
    category: "일식",
    startDate: "2025-01-22",
  },
  {
    id: "dummy-4",
    title: "중화요리 전문점",
    description: "짜장면과 탕수육을 함께 주문해요",
    address: "대구광역시 북구 산격동 456",
    latitude: 35.912,
    longitude: 128.622,
    averagePrice: 18000,
    maxParticipants: 5,
    currentParticipants: 2,
    pictureUrl: "/restaurant.jpg",
    category: "중식",
    startDate: "2025-01-23",
  },
  {
    id: "dummy-5",
    title: "고기 구워먹기",
    description: "삼겹살과 소고기를 함께 구워요",
    address: "대구광역시 북구 대학로 200",
    latitude: 35.894,
    longitude: 128.612,
    averagePrice: 25000,
    maxParticipants: 6,
    currentParticipants: 4,
    pictureUrl: "/restaurant.jpg",
    category: "한식",
    startDate: "2025-01-24",
  },
  {
    id: "dummy-6",
    title: "카페 브런치",
    description: "주말 브런치를 함께 즐겨요",
    address: "대구광역시 북구 복현동 789",
    latitude: 35.906,
    longitude: 128.616,
    averagePrice: 15000,
    maxParticipants: 4,
    currentParticipants: 1,
    pictureUrl: "/restaurant.jpg",
    category: "카페",
    startDate: "2025-01-25",
  },
  {
    id: "dummy-7",
    title: "치킨과 맥주",
    description: "치킨과 맥주를 함께 주문해요",
    address: "대구광역시 북구 산격동 321",
    latitude: 35.9,
    longitude: 128.62,
    averagePrice: 20000,
    maxParticipants: 5,
    currentParticipants: 3,
    pictureUrl: "/restaurant.jpg",
    category: "치킨",
    startDate: "2025-01-26",
  },
  {
    id: "dummy-8",
    title: "회와 막걸리",
    description: "신선한 회를 함께 먹어요",
    address: "대구광역시 북구 대학로 250",
    latitude: 35.898,
    longitude: 128.61,
    averagePrice: 30000,
    maxParticipants: 4,
    currentParticipants: 2,
    pictureUrl: "/restaurant.jpg",
    category: "일식",
    startDate: "2025-01-27",
  },
  {
    id: "dummy-9",
    title: "떡볶이와 순대",
    description: "분식류를 함께 먹어요",
    address: "대구광역시 북구 복현동 654",
    latitude: 35.904,
    longitude: 128.614,
    averagePrice: 8000,
    maxParticipants: 3,
    currentParticipants: 1,
    pictureUrl: "/restaurant.jpg",
    category: "분식",
    startDate: "2025-01-28",
  },
  {
    id: "dummy-10",
    title: "스테이크 하우스",
    description: "고급 스테이크를 함께 즐겨요",
    address: "대구광역시 북구 산격동 987",
    latitude: 35.91,
    longitude: 128.618,
    averagePrice: 35000,
    maxParticipants: 4,
    currentParticipants: 1,
    pictureUrl: "/restaurant.jpg",
    category: "양식",
    startDate: "2025-01-29",
  },
];

export default function MapPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 35.95,
    longitude: 128.46,
  });
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 현재 위치 획득
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("위치 권한 에러:", err);
        // 기본 위치 유지
      }
    );
  }, []);

  // 전체 채팅방 로드 (백엔드 실패 시 더미 데이터 사용)
  useEffect(() => {
    getAllChatRooms()
      .then((data) => {
        if (data && data.length > 0) {
          setChatRooms(data);
        } else {
          // 백엔드 데이터가 없으면 더미 데이터 사용
          setChatRooms(DUMMY_CHAT_ROOMS);
        }
      })
      .catch((e) => {
        console.error("채팅방 로드 실패, 더미 데이터 사용:", e);
        setError(
          "채팅방 정보를 불러오는데 실패했습니다. 더미 데이터를 표시합니다."
        );
        // API 실패 시 더미 데이터 사용
        setChatRooms(DUMMY_CHAT_ROOMS);
      });
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
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
            <div className={styles.currentTooltip}>
              <span>현재 위치</span>
            </div>
          )}
        </MapMarker>

        {/* 채팅방 마커들 - 모든 마커 표시 */}
        {chatRooms.map((room) => (
          <MapMarker
            key={room.id}
            position={{ lat: room.latitude, lng: room.longitude }}
            onMouseOver={() => setHoveredMarkerId(room.id)}
            onMouseOut={() => setHoveredMarkerId(null)}
            onClick={() => setSelectedRoom(room)}
          >
            {hoveredMarkerId === room.id && (
              <div className={styles.tooltip}>
                <div
                  className={styles.tooltipImage}
                  style={{
                    backgroundImage: `url(${
                      room.pictureUrl || "/restaurant.jpg"
                    })`,
                  }}
                />
                <div className={styles.tooltipBody}>
                  <h3 className={styles.tooltipTitle}>{room.title}</h3>
                  <p className={styles.tooltipAddr}>📍 {room.address}</p>
                  <p className={styles.tooltipDate}>
                    📅 {formatDate(room.startDate)}
                  </p>
                  <div className={styles.tooltipTags}>
                    <span className={styles.tag}>
                      {room.category || "한식"}
                    </span>
                    <span className={styles.tag}>
                      {(room.maxParticipants ?? 0) -
                        (room.currentParticipants ?? 0)}
                      명 가능
                    </span>
                  </div>
                </div>
              </div>
            )}
          </MapMarker>
        ))}
      </Map>

      {/* 에러 표시 */}
      {error && <div className={styles.error}>{error}</div>}

      {/* 상세 모달 */}
      {selectedRoom && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedRoom(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div
              className={styles.modalHeaderImage}
              style={{
                backgroundImage: `url(${
                  selectedRoom.pictureUrl || "/restaurant.jpg"
                })`,
              }}
            />
            <button
              className={styles.modalClose}
              onClick={() => setSelectedRoom(null)}
            >
              ✕
            </button>
            <div className={styles.modalInfo}>
              <h2 className={styles.modalTitle}>
                {selectedRoom.title}
                <span className={styles.host}>호스트: 김철수</span>
              </h2>
              <div className={styles.metaRow}>
                <div>📅 {formatDate(selectedRoom.startDate)}</div>
                <div>📍 {selectedRoom.address}</div>
              </div>
              <p className={styles.description}>{selectedRoom.description}</p>
              <div className={styles.tagsRow}>
                <span className={styles.tag}>
                  {selectedRoom.category || "한식"}
                </span>
                <span className={styles.tag}>
                  {(selectedRoom.maxParticipants ?? 0) -
                    (selectedRoom.currentParticipants ?? 0)}
                  명 가능
                </span>
                <span className={styles.tag}>
                  평균 가격: {selectedRoom.averagePrice.toLocaleString()}원
                </span>
              </div>
              <button className={styles.joinBtn}>참여하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
