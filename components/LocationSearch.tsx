"use client";  // Next.js 13 이상의 app 디렉토리에서는 필수, 클라이언트 컴포넌트 명시

import { useEffect, useState } from "react";

// 장소 정보 인터페이스 정의
interface Place {
    place_name: string;   // 장소 이름 (ex. 서울숲)
    address_name: string; // 장소 주소 (ex. 서울 성동구 ...)
    x: string;            // 경도
    y: string;            // 위도
}

const LocationSearch = () => {
    // 검색어 상태
    const [keyword, setKeyword] = useState("");
    // 검색 결과 목록 상태
    const [searchResults, setSearchResults] = useState<Place[]>([]);
    // 카카오 맵 스크립트 로드 여부 상태
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // 카카오 맵 스크립트 동적 로드
    useEffect(() => {
        if (typeof window !== "undefined" && !window.kakao) {  // 아직 kakao 객체가 없을 때만 로드
            const script = document.createElement("script");
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
            script.async = true;
            script.onload = () => {
                window.kakao.maps.load(() => {
                    setIsScriptLoaded(true);  // 스크립트 로드 완료 시 상태 변경
                });
            };
            document.head.appendChild(script);
        } else if (window.kakao && window.kakao.maps) {
            setIsScriptLoaded(true);  // 이미 로드된 경우 바로 true로 설정
        }
    }, []);

    // 장소 검색 실행 함수
    const handleSearch = () => {
        if (!isScriptLoaded) {  // 스크립트가 안 불러와졌으면 검색 못함
            alert("카카오맵 스크립트가 아직 로드되지 않았습니다.");
            return;
        }

        if (!keyword.trim()) return;  // 빈 검색어 방지

        const ps = new window.kakao.maps.services.Places();  // 카카오 장소 검색 서비스 객체 생성

        // 실제 검색 요청
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {  // 검색 성공
                const places = data.map((place: any) => ({
                    place_name: place.place_name,    // 장소명
                    address_name: place.address_name, // 주소명
                    x: place.x,                       // 경도
                    y: place.y                        // 위도
                }));
                setSearchResults(places);  // 검색 결과 상태 저장
            } else {  // 검색 실패
                setSearchResults([]);
                alert("검색 결과가 없습니다.");
            }
        });
    };

    // 검색 결과에서 특정 장소 선택 시 실행되는 함수
    const handleSelectPlace = (place: Place) => {
        setKeyword(place.address_name);  // 검색창에 선택한 주소 표시
        setSearchResults([]);  // 선택 후 결과 리스트 숨김 (깔끔한 UX)

        // 선택 결과를 부모나 다른 곳으로 넘길 필요가 있다면 이 부분에 로직 추가 가능
        alert(`선택한 장소: ${place.place_name}\n주소: ${place.address_name}`);  // 현재는 알림으로 확인
    };

    return (
        <div style={{ color: "white" }}>
            {/* 위치 라벨 */}
            <label style={{ display: "block", marginBottom: "8px" }}>위치</label>

            {/* 검색창 + 검색 버튼 */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="장소를 입력하세요"
                    style={{
                        flex: "0 0 33%",  // 부모 기준 3분의 1 너비 설정
                        padding: "8px",
                        fontSize: "14px",
                        background: "white",
                        color: "black"
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                >
                    🔍
                </button>
            </div>

            {/* 검색 결과 리스트 (있을 때만 표시) */}
            {searchResults.length > 0 && (
                <div style={{
                    marginTop: "8px",
                    background: "#111",
                    color: "white",
                    maxWidth: "33%",  // 검색창과 동일한 너비
                    overflowY: "auto",
                    maxHeight: "200px",  // 최대 높이 설정
                    border: "1px solid #555"
                }}>
                    {searchResults.map((place) => (
                        <div
                            key={place.place_name}  // 장소 이름을 키로 설정
                            onClick={() => handleSelectPlace(place)}  // 클릭 시 주소 선택 처리
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #444",
                                background: "#222"
                            }}
                        >
                            {place.place_name} - {place.address_name}  {/* 장소명 + 주소 표시 */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
