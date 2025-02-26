// 현재 위치 띄우기 기능
// "use client";

// import { useEffect, useState } from "react";

// const KakaoMap = () => {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     console.log("window.kakao 초기 상태:", window.kakao);

//     const script = document.createElement("script");
//     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
//     script.async = true;
//     script.onload = () => {
//       console.log("카카오맵 스크립트 로드 완료");
//       setLoaded(true);
//     };
//     document.head.appendChild(script);
//   }, []);

//   useEffect(() => {
//     if (!loaded) return;

//     console.log("window.kakao.maps 로드 시작...");
//     window.kakao.maps.load(() => {
//       console.log("window.kakao.maps 로드 완료!");
//       const container = document.getElementById("map");

//       // 기본 지도 옵션
//       const options = {
//         center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 기본 위치 (서울)
//         level: 3,
//       };

//       const map = new window.kakao.maps.Map(container, options);
//       console.log("지도 객체 생성 완료:", map);

//       // 현재 위치 가져오기
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const lat = position.coords.latitude;
//             const lng = position.coords.longitude;
//             console.log(`현재 위치: 위도 ${lat}, 경도 ${lng}`);

//             const userLocation = new window.kakao.maps.LatLng(lat, lng);
//             map.setCenter(userLocation); // 지도 중심을 현재 위치로 변경

//             // 마커 추가
//             const marker = new window.kakao.maps.Marker({
//               position: userLocation,
//               map: map,
//             });

//             console.log("현재 위치 마커 추가 완료!");
//           },
//           (error) => {
//             console.error("위치 정보를 가져올 수 없습니다:", error);
//           }
//         );
//       } else {
//         console.error("브라우저가 Geolocation을 지원하지 않습니다.");
//       }
//     });
//   }, [loaded]);

//   return (
//     <>
//       <h1>카카오 지도 테스트</h1>
//       <div id="map" style={{ width: "100%", height: "500px", background: "gray" }} />
//     </>
//   );
// };



// 위치 검색 기능
// export default KakaoMap;

// "use client";

// import { useEffect, useState } from "react";

// const KakaoSearchMap = () => {
//   const [map, setMap] = useState<kakao.maps.Map | null>(null);
//   const [keyword, setKeyword] = useState("");
//   const [places, setPlaces] = useState<kakao.maps.services.Places | null>(null);
//   const [searchResults, setSearchResults] = useState<kakao.maps.services.PlacesSearchResult | null>(null);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
//     script.async = true;
//     script.onload = () => {
//       kakao.maps.load(() => {
//         const container = document.getElementById("map");
//         const options = {
//           center: new kakao.maps.LatLng(37.5665, 126.9780),
//           level: 3,
//         };
//         const newMap = new kakao.maps.Map(container, options);
//         setMap(newMap);
//         setPlaces(new kakao.maps.services.Places());
//       });
//     };
//     document.head.appendChild(script);
//   }, []);

//   const searchPlaces = () => {
//     if (!places) return;
//     places.keywordSearch(keyword, (data, status) => {
//       if (status === kakao.maps.services.Status.OK) {
//         setSearchResults(data);
//       }
//     });
//   };

//   const moveToLocation = (lat: number, lng: number) => {
//     if (!map) return;
//     const moveLatLon = new kakao.maps.LatLng(lat, lng);
//     map.setCenter(moveLatLon);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         placeholder="장소 검색"
//       />
//       <button onClick={searchPlaces}>검색</button>
//       {/* 스크롤 가능한 리스트 스타일 추가 */}
//       <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
//         <ul>
//           {searchResults?.map((place) => (
//             <li key={place.id} onClick={() => moveToLocation(parseFloat(place.y), parseFloat(place.x))}>
//               {place.place_name}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div id="map" style={{ width: "100%", height: "500px", background: "gray" }} />
//     </div>
//   );
// };

// export default KakaoSearchMap;


"use client"; // Next.js13부터는 기본적으로 서버 컴포넌트가 되며, useEffect와 같은 클라이언트 전용 기능 사용 못함. 이걸 명시하면 클라이언트 컴포넌트로 변환되어 정상적으로 사용 가능

import { useEffect, useState } from "react";

const KakaoMap = () => {
  // 상태 변수들 선언
  const [map, setMap] = useState<kakao.maps.Map | null>(null); // 지도 객체 저장
  const [keyword, setKeyword] = useState(""); // 검색어 저장
  const [places, setPlaces] = useState<kakao.maps.services.Places | null>(null); // 장소 검색 API 객체
  const [searchResults, setSearchResults] = useState<kakao.maps.services.Place[]>([]);; // 빈 배열로 초기화, 검색된 장소 목록
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null); // 현재 위치 (위도, 경도)
  const [userMarker, setUserMarker] = useState<kakao.maps.Marker | null>(null);

  useEffect(() => {
    // 카카오 맵 API 스크립트 동적으로 추가
    const script = document.createElement("script"); // html에 script태그 직접 작성하지 않아도, 코드 실행 시 자동으로 추가
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        console.log("Kakao Maps API 로드 완료!");
        const container = document.getElementById("map"); // 지도를 표시할 div요소 가져오기
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본 지도 중심 (서울)
          level: 3,
        };

        // 지도 객체 생성 후 상태에 저장
        const newMap = new kakao.maps.Map(container, options);
        setMap(newMap);
        setPlaces(new kakao.maps.services.Places()); // 장소 검색 API 객체 생성 -> 저장 후, keywordSearch()에서 사용

        // 현재 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              console.log(`현재 위치: 위도 ${lat}, 경도 ${lng}`);

              setCurrentLocation({ lat, lng }); // 현재 위치 상태 업데이트

              const userLocation = new kakao.maps.LatLng(lat, lng);
              newMap.setCenter(userLocation); // 지도 중심을 현재 위치로 변경

              // 현재 위치 마커 추가
              const marker = new kakao.maps.Marker({
                position: userLocation,
                map: newMap,
              });

              console.log("현재 위치 마커 추가 완료!");
            },
            (error) => {
              console.error("위치 정보를 가져올 수 없습니다:", error);
            }
          );
        } else {
          console.error("브라우저가 Geolocation을 지원하지 않습니다.");
        }
      });
    };
    document.head.appendChild(script);
  }, []);

  // 현재 위치 기반으로 레스토랑 목록 요청 (백엔드 API 호출)
  useEffect(() => {
    if (!currentLocation) return;

    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/restaurant/nearby?lat=${currentLocation.lat}&lng=${currentLocation.lng}&radius=3000`
        );
        const data = await response.json();
        console.log("반경 내 레스토랑 데이터:", data);
        setSearchResults(data);
      } catch (error) {
        console.error("레스토랑 데이터를 가져오는데 실패했습니다.", error);
      }
    };

    fetchRestaurants();
  }, [currentLocation]); // 위치 정보가 바뀌면 실행됨

  // 레스토랑 목록을 지도에 마커로 표시
  useEffect(() => {
    if (!map || !searchResults || searchResults.length === 0) return;

    const markers: kakao.maps.Marker[] = [];

    if (Array.isArray(searchResults)) {
      searchResults.forEach((restaurant) => {
        const position = new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);
    
        const marker = new kakao.maps.Marker({
          position,
          map,
        });
        
        marker.restaurantId = restaurant.restaurantId; // key 역할(React에서 직접 쓰는 건 아님)
        markers.push(marker);
      });
    } else {
      console.error("searchResults가 배열이 아닙니다:", searchResults);
    }

    console.log("지도에 레스토랑 마커 추가 완료!");
  }, [map, searchResults]);

  // 장소 검색 함수
  const searchPlaces = () => {
    if (!places) return;
    places.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(data); // 검색 결과 상태 업데이트
  
        // Move map to first result
        const firstPlace = data[0];
        if (firstPlace) {
          moveToLocation(parseFloat(firstPlace.y), parseFloat(firstPlace.x));
        }
      } else {
        console.error("장소 검색 실패:", status);
      }
    });
  };

  // 선택한 장소로 지도 이동하는 함수
  const moveToLocation = (lat: number, lng: number) => {
    if (!map) return;
  
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.setCenter(moveLatLon); // 지도 중심 이동
  
    // 기존 사용자 마커 제거
    if (userMarker) {
      userMarker.setMap(null);
    }
  
    // 새로운 마커 생성 후 상태 업데이트
    const newMarker = new kakao.maps.Marker({
      position: moveLatLon,
      map: map, 
    });
  
    setUserMarker(newMarker);
  };

  return (
    <div>
      <h1>카카오 지도 테스트</h1>

      {/* 장소 검색 UI */}
      <div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="장소 검색"
        />
        <button onClick={searchPlaces}>검색</button>
      </div>


      {/* 검색 결과 리스트 (스크롤 가능) */}
      <div style={{ maxHeight: "150px", maxWidth: "400px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
        <ul>
          {Array.isArray(searchResults) &&
            searchResults.map((place, index) => (
              <li 
                key={place.id || index} 
                onClick={() => {
                  console.log("Clicked place:", place);
                  moveToLocation(
                    parseFloat(place.y) || parseFloat(place.latitude), 
                    parseFloat(place.x) || parseFloat(place.longitude)
                  );
                }}
                style={{ cursor: "pointer" }} 
              >
                {place.place_name}
              </li>
            ))}
        </ul>
      </div>


      {/* 현재 위치 정보 출력 */}
      {currentLocation && (
        <div style={{ marginBottom: "10px" }}>
          <strong>현재 위치:</strong> 위도 {currentLocation.lat}, 경도 {currentLocation.lng}
        </div>
      )}

      {/* 지도 표시 */}
      <div id="map" style={{ width: "100%", height: "500px", background: "gray" }} />
    </div>
  );
};
export default KakaoMap;