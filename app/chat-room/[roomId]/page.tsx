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
  const { roomId } = useParams();
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
  const { messages, sendMessage, userList } = useChat(roomId as string);
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);

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
      } catch (error) {
        console.error("소셜다이닝 데이터를 가져오는데 실패했습니다:", error);
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
        <h1 className={styles.chatRoomTitle}>Chat Room: {roomInfo.title}</h1>
        <Image
          className={styles.chatRoomHeaderButton}
          src="/hambugi.png"
          alt="logo"
          width={100}
          height={100}
          onClick={() => setShowSidePanel(!showSidePanel)}
        />
      </div>
      <div className={styles.chatRoomMessages}>
        {messages.map((message: ChatMessage) => (
          <div
            key={message.id}
            className={`${styles.messageContainer} ${
              message.isSystem
                ? styles.systemMessage
                : message.isCurrentUser
                ? styles.myMessage
                : styles.otherMessage
            }`}
          >
            <div className={styles.messageContent}>
              {!message.isSystem && (
                <div className={styles.messageName}>{message.userName}</div>
              )}
              <div className={styles.messageText}>{message.message}</div>
              <div className={styles.messageTime}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatRoomInputContainer}>
        <input
          className={styles.chatRoomInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              sendMessage(input);
              setInput("");
            }
          }}
          placeholder="메시지를 입력하세요"
        />
        <button
          className={styles.sendButton}
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
        >
          전송
        </button>
      </div>
      {showSidePanel && (
        <div
          className={`${styles.sidePanel} ${
            !showSidePanel ? styles.hidden : ""
          }`}
        >
          <div className={styles.sidePanelContent}>
            <p className={styles.sidePanelInfo}>소셜다이닝 정보</p>
            <p className={styles.sidePanelInfo}>참여자 정보</p>
            {userList.map((user) => (
              <p key={user.id} className={styles.sidePanelInfo}>
                {user.userId.pictureUrl ? (
                  <Image
                    src={user.userId.pictureUrl}
                    alt="profile"
                    width={50}
                    height={50}
                  />
                ) : null}
                {user.userId.name}
              </p>
            ))}
            <p className={styles.sidePanelInfo}>방 나가기</p>

            {/* <p className={styles.sidePanelTitle}>Title: {roomInfo.title}</p>
            <p className={styles.sidePanelDescription}>
              Description: {roomInfo.description}
            </p>
            <p className={styles.sidePanelStatus}>Status: {roomInfo.status}</p>
            <p className={styles.sidePanelStartDate}>
              Start Date: {roomInfo.startDate}
            </p>
            <p className={styles.sidePanelMaxParticipants}>
              Max Participants: {roomInfo.maxParticipants}
            </p>
            <p className={styles.sidePanelGender}>Gender: {roomInfo.gender}</p>
            <p className={styles.sidePanelMinAge}>Min Age: {roomInfo.minAge}</p>
            <p className={styles.sidePanelMaxAge}>Max Age: {roomInfo.maxAge}</p>
            <p className={styles.sidePanelAddress}>
              Address: {roomInfo.address}
            </p>
            <p className={styles.sidePanelPrice}>Price: {roomInfo.price}</p> */}
          </div>
        </div>
      )}
    </div>
  );
}
