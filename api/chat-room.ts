import {
  ChatRoom,
  CreateChatRoomDto,
  FilterChatRoomDto,
} from "../types/chat-room";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper function to get headers with token
const getHeaders = (contentType = "application/json") => {
  const token = localStorage.getItem("jwtToken");
  return {
    Accept: "application/json",
    "Content-Type": contentType,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// 모든 채팅방 조회
export const getAllChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await fetch(`${API_URL}/api/chat-room`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch chat rooms");
  }
  return response.json();
};

// 채팅방 생성
export const createChatRoom = async (
  data: CreateChatRoomDto
): Promise<ChatRoom> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(`${API_URL}/api/chat-room`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: getHeaders("multipart/form-data"),
  });

  if (!response.ok) {
    throw new Error("Failed to create chat room");
  }

  return response.json();
};

// 특정 채팅방 조회
export const getChatRoom = async (id: number): Promise<ChatRoom> => {
  const response = await fetch(`${API_URL}/api/chat-room/${id}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch chat room");
  }
  return response.json();
};

// 채팅방 필터링
export const getFilteredChatRooms = async (
  filterDto: FilterChatRoomDto
): Promise<ChatRoom[]> => {
  const queryParams = new URLSearchParams();
  Object.entries(filterDto).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, String(v)));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const response = await fetch(`${API_URL}/api/chat-room/map?${queryParams}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch filtered chat rooms");
  }

  return response.json();
};
