"use client";

import { useEffect, useState } from "react";

// 레스토랑 정보와 연결된 채팅방 정보 타입 정의
interface Restaurant {
    restaurantId: string;
    restaurantName: string;
    latitude: number;
    longitude: number;
    chatRoom: {
        title: string;
        description: string;
        startDate: string;
        price: number;
    };
}

// 카카오맵 컴포넌트
const KakaoMap = () => {
    const [map, setMap] = useState<kakao.maps.Map | null>(null);  // 카카오맵 객체 상태
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);  // 현재 위치 저장
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);  // 레스토랑 리스트 상태
    const [hoveredChatRoom, setHoveredChatRoom] = useState<Restaurant["chatRoom"] | null>(null);  // 마커에 마우스 올렸을 때 보여줄 정보
    const [selectedChatRoom, setSelectedChatRoom] = useState<Restaurant["chatRoom"] | null>(null);  // 마커 클릭 시 보여줄 상세 정보

    // 카카오맵 API 스크립트 동적 로드
    useEffect(() => {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => {
            kakao.maps.load(() => {
                initMap();
            });
        };
        document.head.appendChild(script);
    }, []);

    // 지도 초기화 및 현재 위치 설정
    const initMap = () => {
        const container = document.getElementById("map");
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),  // 기본 중심 (서울 시청)
            level: 5,  // 줌 레벨
        };
        const newMap = new kakao.maps.Map(container, options);
        setMap(newMap);

        // 현재 위치 가져오기
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCurrentLocation({ lat, lng });

                    // 현재 위치로 지도 이동
                    const currentPosition = new kakao.maps.LatLng(lat, lng);
                    newMap.setCenter(currentPosition);
                    newMap.setLevel(5);

                    // 현재 위치에 커스텀 마커 표시
                    const markerImage = new kakao.maps.MarkerImage(
                        "/currentPlace.png",  // public 폴더의 이미지 사용
                        new kakao.maps.Size(40, 40), 
                        { offset: new kakao.maps.Point(20, 40) }  // 기준점 아래로 맞춤
                    );

                    new kakao.maps.Marker({
                        position: currentPosition,
                        map: newMap,
                        image: markerImage,
                    });

                    // 전체 레스토랑 데이터 조회
                    fetchAllRestaurants();
                },
                (error) => {
                    console.error("위치 정보를 가져올 수 없습니다:", error);
                    fetchAllRestaurants();
                }
            );
        } else {
            fetchAllRestaurants();
        }
    };

    // 전체 레스토랑 데이터 불러오기
    const fetchAllRestaurants = async () => {
        try {
            const response = await fetch(`http://localhost:3001/restaurant/all`);
            const data = await response.json();
            console.log("전체 레스토랑 데이터:", data);
            setRestaurants(data);
        } catch (error) {
            console.error("전체 레스토랑 데이터를 불러오는데 실패했습니다.", error);
        }
    };

    // 레스토랑 마커 표시 및 이벤트 등록
    useEffect(() => {
        if (!map || restaurants.length === 0) return;

        const markers: kakao.maps.Marker[] = [];

        restaurants.forEach((restaurant) => {
            const position = new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);
            const marker = new kakao.maps.Marker({ position, map });

            (marker as any).restaurantData = restaurant;

            const kakaoEvent = (kakao.maps as any).event;

            // 마커에 마우스 오버 시 간략 정보 표시
            kakaoEvent.addListener(marker, "mouseover", () => {
                setHoveredChatRoom(restaurant.chatRoom);
            });

            // 마우스 아웃 시 정보 숨김
            kakaoEvent.addListener(marker, "mouseout", () => {
                setHoveredChatRoom(null);
            });

            // 마커 클릭 시 상세 모달 표시
            kakaoEvent.addListener(marker, "click", () => {
                setHoveredChatRoom(null);  // 클릭 시 hover 정보는 숨김
                setSelectedChatRoom(restaurant.chatRoom);
            });

            markers.push(marker);
        });

        // 컴포넌트 언마운트 시 마커 제거
        return () => markers.forEach(marker => marker.setMap(null));
    }, [map, restaurants]);

    return (
        <div>
            <h1>소셜다이닝 지도</h1>

            {/* Hover 시 간단 설명 박스 */}
            {hoveredChatRoom && (
                <div style={{ position: "absolute", top: "100px", right: "20px", background: "white", padding: "10px", border: "1px solid #ddd", zIndex: 10, color: "black" }}>
                    <h4>{hoveredChatRoom.title}</h4>
                    <p>{hoveredChatRoom.startDate}</p>
                    <p>{hoveredChatRoom.description}</p>
                </div>
            )}

            {/* 마커 클릭 시 상세 모달 */}
            {selectedChatRoom && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", padding: "20px", border: "1px solid #ddd", zIndex: 100, color: "black" }}>
                    <h2>{selectedChatRoom.title}</h2>
                    <p>{selectedChatRoom.description}</p>
                    <p>날짜: {selectedChatRoom.startDate}</p>
                    <p>가격: {selectedChatRoom.price.toLocaleString()}원</p>
                    <button onClick={() => setSelectedChatRoom(null)}>닫기</button>
                </div>
            )}

            {/* 지도 표시 영역 */}
            <div id="map" style={{ width: "100%", height: "500px", marginTop: "10px" }} />
        </div>
    );
};

export default KakaoMap;