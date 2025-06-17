import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const token = localStorage.getItem("jwtToken");

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/chat-room/join`, {
  transports: ["websocket"], // WebSocket만 사용 (보안 Http 풀링방지)
  withCredentials: true,
  auth: {
    token: token,
  },
});
export const useChat = (roomId: string) => {
  // 메세지 목록
  const [messages, setMessages] = useState<string[]>([]);
  // 채팅 참여자 목록
  const [participants, setParticipants] = useState([]);
  // 개최자인지 아닌지 저장
  const [role, setRole] = useState("");

  useEffect(() => {
    // 채팅방 참여
    socket.emit("joinRoom", roomId);

    // 채팅목록 가져오기
    socket.emit("getMessages", roomId);

    // 채팅방 참여자 목록 가져오기 이벤트 요청
    socket.emit("getRoomParticipants", roomId);

    // 서버에서 응답받은 참여자 목록
    // 이름, 역할, 사진, 자기소개, id
    // 배열로 저장할 필요가 있음
    socket.on("roomParticipants", (users) => {
      console.log(users);
    });

    // 유저 역할 저장
    socket.on("role", (host) => {
      setRole(host);
    });

    socket.on("messages", (msg) => {
      setMessages((prev) => [...prev, ...msg]);
    });

    // 메세지 수신
    socket.on("message", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, [roomId]);

  // 메세지 보내기
  const sendMessage = (msg: string) => {
    socket.emit("message", { roomId, message: msg });
  };

  // 채팅방 나가기 나가고 나서 메인페이지로
  const leaveRoom = () => {
    socket.emit("leaveRoom", { roomId });
  };

  return { messages, role, sendMessage, leaveRoom };
};
