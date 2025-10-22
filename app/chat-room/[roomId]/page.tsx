"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import Image from "next/image";

interface ChatMessage {
  id?: string;
  userName: string;
  message: string;
  createdAt: string;
  isSystem?: boolean;
  isCurrentUser: boolean;
}

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
  const [showSidePanel, setShowSidePanel] = useState(false);
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
      <div className={styles.chatRoomHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.chatRoomTitle}>{roomInfo.title}</h1>
          <h2 className={styles.chatRoomRole}>{role ? role : "GUEST"}</h2>
        </div>
        <button
          className={styles.chatRoomHeaderButton}
          onClick={() => setShowSidePanel(!showSidePanel)}
        >
          <Image src="/hambugi.png" alt="menu" width={40} height={40} />
        </button>
      </div>

      {/* 사이드 패널 */}
      <div
        className={`${styles.sidePanel} ${!showSidePanel ? styles.hidden : ""}`}
      >
        <button
          className={styles.sidePanelClose}
          onClick={() => setShowSidePanel(false)}
        >
          ✕
        </button>
        <div className={styles.sidePanelContent}>
          <div className={styles.sidePanelInfo}>
            참여자 ({userList.length} / {roomInfo.maxParticipants})
          </div>
          {userList.map((user, index) => (
            <div key={index} className={styles.sidePanelProfile}>
              <Image
                src={user.userId.pictureUrl || "/profile/profile1.png"}
                alt={user.userId.name}
                width={40}
                height={40}
                className={styles.sidePanelProfileImg}
              />
              <span className={styles.sidePanelProfileName}>
                {user.userId.name}
                {user.role === "HOST" && " (HOST)"}
              </span>
            </div>
          ))}
          <div className={styles.buttonContainer}>
            <button
              onClick={() => {
                leaveRoom();
              }}
              className={styles.leaveButton}
            >
              채팅방 나가기
            </button>
            {role === "HOST" && (
              <button className={styles.hostButton}>리뷰요청하기</button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.chatRoomMessages}>
        {messages.map((msg: ChatMessage, index: number) => (
          <div
            key={msg.id || index}
            className={`${styles.messageContainer} ${
              msg.isSystem
                ? styles.systemMessage
                : msg.isCurrentUser
                ? styles.myMessage
                : styles.otherMessage
            }`}
          >
            <div className={styles.messageContent}>
              {!msg.isSystem && (
                <div className={styles.messageName}>{msg.userName}</div>
              )}
              <div className={styles.messageText}>{msg.message}</div>
              <div className={styles.messageTime}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatRoomInputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className={styles.chatRoomInput}
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
          className={styles.sendButton}
        >
          전송
        </button>
      </div>
    </div>
  );
}
