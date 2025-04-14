"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const FilterPage = () => {
  const [filters, setFilters] = useState({
    minAge: 20,
    maxAge: 50,
    minPrice: 10000,
    maxPrice: 50000,
    radius: 5000,
    tags: [],
    categories: [],
  });

  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(
      `${apiUrl}/api/chat-room/map?radius=${filters.radius}&minAge=${filters.minAge}&maxAge=${filters.maxAge}
      &minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&tags=${filters.tags.join(",")}`
    )
      .then((res) => res.json())
      .then((data) => setChatRooms(data))
      .catch((err) => console.error(err));
  }, [filters]);

  return (
    <div>
      <h2>검색한 소셜 다이닝</h2>
      <div className="filters">
        <label>최소 나이</label>
        <input
          type="number"
          value={filters.minAge}
          onChange={(e) => setFilters({ ...filters, minAge: Number(e.target.value) })}
        />

        <label>최대 나이</label>
        <input
          type="number"
          value={filters.maxAge}
          onChange={(e) => setFilters({ ...filters, maxAge: Number(e.target.value) })}
        />

        <label>태그</label>
        <select
          multiple
          onChange={(e) => setFilters({ ...filters, tags: Array.from(e.target.selectedOptions, (opt) => opt.value) })}
        >
          <option value="친목">친목</option>
          <option value="술">술</option>
          <option value="미식">미식</option>
        </select>
      </div>

      <Map center={{ lat: 35.95, lng: 128.46 }} style={{ width: "100%", height: "500px" }} level={5}>
        {chatRooms.map((room) => (
          <MapMarker key={room.id} position={{ lat: room.latitude, lng: room.longitude }} />
        ))}
      </Map>

      <div className="search-results">
        {chatRooms.map((room) => (
          <div key={room.id} className="card">
            <img src={room.picture_url} alt={room.title} />
            <h3>{room.title}</h3>
            <p>{room.address}</p>
            <p>🗓 {room.start_date}</p>
            <p>💰 {room.average_price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPage;
