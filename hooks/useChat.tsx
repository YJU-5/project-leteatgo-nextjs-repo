import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

const token = localStorage.getItem("jwtToken");

const socket = io("http://localhost:3001/chat-room/join", {
  transports: ["websocket"], // WebSocket만 사용 (보안 Http 풀링방지)
  withCredentials: true,
  auth: {
    token: token,
  },
});

export const useChat = (roomId: string) => {
  const router = useRouter();

  // 메세지 목록
  const [messages, setMessages] = useState<any[]>([]);
  // 개최자인지 아닌지 저장
  const [role, setRole] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);

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
      setUserList(users);
      console.log(users);
    });

    // 유저 역할 저장
    socket.on("role", (host) => {
      setRole(host);
    });

    // 초기 메시지 목록 받기
    socket.on("messages", (msgList) => {
      setMessages(msgList);
    });

    // 새 메시지 수신
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      socket.off("roomParticipants");
      socket.off("role");
      socket.off("messages");
      socket.off("message");
    };
  }, [roomId]);

  // 메세지 보내기
  const sendMessage = (msg: string) => {
    socket.emit("message", { roomId, message: msg });
  };

  // 채팅방 나가기 나가고 나서 메인페이지로
  const leaveRoom = () => {
    // 서버에 나가기 알림
    socket.emit("leaveRoom", { roomId });

    // 유저 목록 새로고침 요청
    socket.emit("getRoomParticipants", roomId);

    // 메인 페이지로 이동
    router.push("/");
  };

  return { messages, role, sendMessage, leaveRoom, userList };
};