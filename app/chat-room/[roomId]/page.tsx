"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import Image from "next/image";
import Description from "@/components/Description/Description";

interface ChatMessage {
  id?: string;
  userName: string;
  message: string;
  createdAt: string;
  isSystem?: boolean;
  isCurrentUser: boolean;
}

interface Host {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  birthday: string | null;
  gender: string | null;
  pictureUrl: string;
  description: string | null;
  role: string;
  socialProvider: string;
  socialId: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface Content {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string;
  maxParticipants: number;
  gender: string;
  pictureUrl: string;
  minAge: number;
  maxAge: number;
  latitude: string;
  longitude: string;
  address: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  isActive: number;
  profileImg: string;
  username: string;
  name: string;
  hostId: Host;
}

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState<Content>({
    id: 0,
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
    profileImg: "",
    username: "",
    name: "",
    hostId: {
      id: "",
      name: "",
      email: "",
      phoneNumber: null,
      birthday: null,
      gender: null,
      pictureUrl: "",
      description: null,
      role: "",
      socialProvider: "",
      socialId: "",
      createdAt: "",
      updatedAt: "",
      deleted: false,
    },
  });

  const { messages, sendMessage, userList } = useChat(roomId as string);
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const { leaveRoom } = useChat(roomId as string);

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
          id: 0,
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
          profileImg: "",
          username: "",
          name: "",
          hostId: {
            id: "",
            name: "",
            email: "",
            phoneNumber: null,
            birthday: null,
            gender: null,
            pictureUrl: "",
            description: null,
            role: "",
            socialProvider: "",
            socialId: "",
            createdAt: "",
            updatedAt: "",
            deleted: false,
          },
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
      {selectedContent && (
        <Description
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          link={false}
        />
      )}
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
            <p
              className={styles.sidePanelInfo}
              onClick={() => setSelectedContent(roomInfo)}
            >
              소셜다이닝 정보
            </p>
            <hr
              style={{
                margin: "10px 0",
                border: "0.5px solid #fff",
              }}
            />
            <p className={styles.sidePanelInfo}>참여자 정보</p>
            {userList.map((user) => (
              <div key={user.id} className={styles.sidePanelProfile}>
                {user.userId.pictureUrl ? (
                  <Image
                    src={user.userId.pictureUrl}
                    className={styles.sidePanelProfileImg}
                    alt="profile"
                    width={50}
                    height={50}
                  />
                ) : null}
                <p className={styles.sidePanelProfileName}>
                  {user.userId.name}
                </p>
              </div>
            ))}
            <hr
              style={{
                margin: "10px 0",
                border: "0.5px solid #fff",
              }}
            />
            <p className={styles.sidePanelInfo} onClick={() => leaveRoom()}>
              방 나가기
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
