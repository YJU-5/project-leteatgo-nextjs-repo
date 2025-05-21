import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id?: string;
  userName: string;
  message: string;
  createdAt: string;
  isSystem?: boolean;
  isCurrentUser: boolean;
}

interface ChatUser {
  id: string;
  isActive: boolean;
  isOnline: boolean;
  joinAt: string;
  role: string;
  userId: {
    id: string;
    name: string;
    pictureUrl: string;
  };
}

interface UseChatReturn {
  messages: ChatMessage[];
  role: string;
  sendMessage: (msg: string) => void;
  leaveRoom: () => void;
  userList: ChatUser[];
  currentUserId: string;
  currentUserName: string;
  typingUsers: string[];
  setTyping: (isTyping: boolean) => void;
}

export const useChat = (roomId: string): UseChatReturn => {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 메세지 목록
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 개최자인지 아닌지 저장
  const [role, setRole] = useState<string>("");
  const [userList, setUserList] = useState<ChatUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // localStorage에서 사용자 정보 가져오기
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const { name } = JSON.parse(userInfo);
      setCurrentUserName(name);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    // 소켓 연결 생성
    socketRef.current = io(
      `${process.env.NEXT_PUBLIC_API_URL}/chat-room/join`,
      {
        transports: ["websocket"],
        withCredentials: true,
        auth: {
          token: token,
        },
      }
    );

    const socket = socketRef.current;

    if (socket) {
      console.log("Socket connected:", socket.id);
      // 채팅방 참여
      socket.emit("joinRoom", roomId);
      console.log("Emitted joinRoom event with roomId:", roomId);

      // 채팅목록 가져오기
      socket.emit("getMessages", { roomId });
      console.log("Emitted getMessages event with roomId:", roomId);

      // 채팅방 참여자 목록 가져오기 이벤트 요청
      socket.emit("getRoomParticipants", roomId);
      console.log("Emitted getRoomParticipants event with roomId:", roomId);

      // 서버에서 응답받은 참여자 목록
      socket.on("roomParticipants", (users) => {
        console.log("Received roomParticipants:", users);
        setUserList(users);

        // localStorage에서 사용자 정보가 없는 경우에만 소켓에서 가져온 정보 사용
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) {
          const currentUser = users.find((user: ChatUser) => {
            console.log(
              "Checking user role:",
              user.role,
              "against current role:",
              role
            );
            return user.role === role;
          });
          if (currentUser) {
            console.log("Found current user:", currentUser);
            setCurrentUserId(currentUser.id);
            setCurrentUserName(currentUser.name);
          }
        }
      });

      // 유저 역할 저장
      socket.on("role", (host) => {
        console.log("Received role:", host);
        setRole(host);
      });

      // 초기 메시지 목록 받기
      socket.on("messages", (messageList: ChatMessage[]) => {
        console.log("Received initial messages:", messageList);
        // localStorage에서 현재 사용자 정보 가져오기
        const userInfo = localStorage.getItem("user");
        const currentUser = userInfo ? JSON.parse(userInfo) : null;

        // 서버에서 오는 메시지 형식을 ChatMessage 형식으로 변환
        const formattedMessages = messageList.map((message) => ({
          id: message.id || Date.now().toString(),
          userName: message.userName || "알 수 없음",
          message: message.message || "",
          createdAt: message.createdAt || new Date().toISOString(),
          isSystem: message.isSystem || false,
          isCurrentUser: !!currentUser && message.userName === currentUser.name,
        }));
        console.log("Formatted messages:", formattedMessages);
        setMessages(formattedMessages);
      });

      // 새 메시지 수신
      socket.on("message", (message: ChatMessage | string) => {
        console.log("Received new message:", message);
        // localStorage에서 현재 사용자 정보 가져오기
        const userInfo = localStorage.getItem("user");
        const currentUser = userInfo ? JSON.parse(userInfo) : null;

        // 문자열로 온 시스템 메시지를 객체로 변환
        const formattedMessage: ChatMessage =
          typeof message === "string"
            ? {
                id: `system_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                userName: "System",
                message: message,
                createdAt: new Date().toISOString(),
                isSystem: true,
                isCurrentUser: false,
              }
            : {
                id:
                  message.id ||
                  `msg_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                userName: message.userName || "알 수 없음",
                message: message.message || "",
                createdAt: message.createdAt || new Date().toISOString(),
                isSystem: message.isSystem || false,
                isCurrentUser:
                  !!currentUser && message.userName === currentUser.name,
              };

        console.log("Formatted new message:", formattedMessage);
        setMessages((prev) => [...prev, formattedMessage]);
      });

      // 타이핑 중인 사용자 목록 업데이트
      socket.on("typing", (data) => {
        console.log("Received typing event:", data);
        if (data.roomId === roomId) {
          setTypingUsers(data.typingUsers);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        // 토큰이 만료되었거나 유효하지 않은 경우 처리
        if (error.message.includes("JWT")) {
          console.error("JWT authentication error:", error.message);
          // 토큰 갱신 로직 또는 로그인 페이지로 리다이렉트
        }
      });

      // 소켓 연결 해제 이벤트
      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 소켓 연결 해제
      return () => {
        console.log("Cleaning up socket connection...");
        socket.off("roomParticipants");
        socket.off("role");
        socket.off("messages");
        socket.off("message");
        socket.off("typing");
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [roomId]);

  useEffect(() => {
    if (role && userList.length > 0) {
      // localStorage에서 사용자 정보가 없는 경우에만 소켓에서 가져온 정보 사용
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        const currentUser = userList.find(
          (user: ChatUser) => user.role === role
        );
        if (currentUser) {
          setCurrentUserId(currentUser.id);
          setCurrentUserName(currentUser.userId.name);
        }
      }
    }
  }, [role, userList]);

  // 타이핑 상태 설정
  const setTyping = (isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { roomId, isTyping });

      // 타이핑 상태가 true인 경우 3초 후에 자동으로 false로 변경
      if (isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          if (socketRef.current) {
            socketRef.current.emit("typing", { roomId, isTyping: false });
          }
        }, 3000);
      }
    }
  };

  // 메세지 보내기
  const sendMessage = (msg: string) => {
    if (!msg.trim()) return; // 빈 메시지 체크 추가

    if (socketRef.current) {
      console.log("Sending message:", msg);
      // 타이핑 상태 해제
      socketRef.current.emit("typing", { roomId, isTyping: false });

      // 메시지 전송
      socketRef.current.emit("message", { roomId, message: msg.trim() });
    }
  };

  // 채팅방 나가기
  const leaveRoom = () => {
    if (socketRef.current) {
      console.log("Leaving room:", roomId);
      // 서버에 나가기 알림
      socketRef.current.emit("leaveRoom", { roomId });

      // 소켓 연결 해제
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // 상태 초기화
    setMessages([]);
    setUserList([]);
    setRole("");
    setCurrentUserId("");
    setCurrentUserName("");
    setTypingUsers([]);

    // 메인 페이지로 이동
    router.push("/");
  };

  return {
    messages,
    role,
    sendMessage,
    leaveRoom,
    userList,
    currentUserId,
    currentUserName,
    typingUsers,
    setTyping,
  };
};
