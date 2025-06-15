import {
  ChatRoom,
  CreateChatRoomDto,
  FilterChatRoomDto,
} from "../types/chat-room";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper function to get headers with token
const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// 모든 채팅방 조회
export const getAllChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    console.log("Fetching chat rooms from:", `${API_URL}/chat-room`);
    const response = await fetch(`${API_URL}/chat-room`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server response:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received chat rooms:", data);
    return data;
  } catch (error) {
    console.error("Error in getAllChatRooms:", error);
    throw error;
  }
};

// 채팅방 생성
export const createChatRoom = async (
  data: CreateChatRoomDto
): Promise<ChatRoom> => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    console.log("Creating chat room:", data);
    const response = await fetch(`${API_URL}/chat-room`, {
      method: "POST",
      body: formData,
      headers: getHeaders(true),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server response:", errorData);
      throw new Error("Failed to create chat room");
    }

    const result = await response.json();
    console.log("Created chat room:", result);
    return result;
  } catch (error) {
    console.error("Error in createChatRoom:", error);
    throw error;
  }
};

// 특정 채팅방 조회
export const getChatRoom = async (id: number): Promise<ChatRoom> => {
  try {
    console.log("Fetching chat room:", id);
    const response = await fetch(`${API_URL}/chat-room/${id}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server response:", errorData);
      throw new Error("Failed to fetch chat room");
    }

    const data = await response.json();
    console.log("Received chat room:", data);
    return data;
  } catch (error) {
    console.error("Error in getChatRoom:", error);
    throw error;
  }
};

// 채팅방 필터링
export const getFilteredChatRooms = async (
  filterDto: FilterChatRoomDto
): Promise<ChatRoom[]> => {
  try {
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

    console.log("Fetching filtered chat rooms with params:", filterDto);
    const response = await fetch(`${API_URL}/chat-room/map?${queryParams}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server response:", errorData);
      throw new Error("Failed to fetch filtered chat rooms");
    }

    const data = await response.json();
    console.log("Received filtered chat rooms:", data);
    return data;
  } catch (error) {
    console.error("Error in getFilteredChatRooms:", error);
    throw error;
  }
};
