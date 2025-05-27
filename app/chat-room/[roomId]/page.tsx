"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import Image from "next/image";

export default function ChatRoomPage() {
  const { roomId } = useParams(); // 동적 라우트 값
  const [roomInfo, setRoomInfo] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
    startDate: "",
    maxParticipants: 0,
    gender: "",
    pictureUrl: "",
    minAge: 0,
    maxAge: 0,
    latitude: "",
    longitude: "",
    address: "",
    price: 0,
    createdAt: "",
    updatedAt: "",
    isActive: 0,
  });
  const { messages, role, sendMessage, leaveRoom, userList } = useChat(
    roomId as string
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤을 가장 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat-room/${roomId}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRoomInfo(data);
        console.log(data);
      } catch (error) {
        console.error("소셜다이닝 데이터를 가져오는데 실패했습니다:", error);
        // 에러 발생 시 빈 배열 설정
        setRoomInfo({
          id: "",
          title: "",
          description: "",
          status: "",
          startDate: "",
          maxParticipants: 0,
          gender: "",
          pictureUrl: "",
          minAge: 0,
          maxAge: 0,
          latitude: "",
          longitude: "",
          address: "",
          price: 0,
          createdAt: "",
          updatedAt: "",
          isActive: 0,
        });
      }
    };

    fetchRoomInfo();
  }, [roomId]);

  if (!roomId) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.chatRoom}>
      <h1 className={styles.chatRoomTitle}>Chat Room: {roomInfo.title}</h1>
      <h2>
        {userList.length} / {roomInfo.maxParticipants}
      </h2>
      <h2 className={styles.chatRoomRole}>유저역할 : {role ? role : ""}</h2>
      <Image src="/hambugi.png" alt="logo" width={100} height={100} />
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
        }}
        className={styles.chatRoomMessages}
      >
        {messages.map((msg: any, index: number) => (
          <div key={index}>{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(input);
            setInput("");
          }
        }}
        placeholder="메시지를 입력하세요"
      />
      <button
        onClick={() => {
          sendMessage(input);
          setInput("");
        }}
      >
        전송
      </button>
      <button
        onClick={() => {
          leaveRoom();
        }}
      >
        채팅방 나가기
      </button>
      {role === "HOST" ? <button>리뷰요청하기</button> : ""}
    </div>
  );
}
