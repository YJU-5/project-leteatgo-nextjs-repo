import type { ChatRoom } from "../types/chat-room";

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export async function getAllChatRooms(): Promise<ChatRoom[]> {
  const res = await fetch(`${API_URL}/chat-room`, {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch chat rooms: ${res.status}`);
  }

  const data = await res.json();

  // 백엔드 응답을 프론트엔드 타입에 맞게 변환
  return data.map((room: any) => ({
    id: room.id,
    title: room.title || "",
    description: room.description || "",
    address: room.address || "",
    latitude: Number(room.latitude) || 0,
    longitude: Number(room.longitude) || 0,
    averagePrice: room.price || 0, // price → averagePrice 변환
    maxParticipants: room.maxParticipants || 0,
    currentParticipants: Array.isArray(room.userChatRooms)
      ? room.userChatRooms.length
      : 0,
    pictureUrl: room.pictureUrl || null,
    category: room.categories?.[0]?.name || null,
    startDate: room.startDate
      ? typeof room.startDate === "string"
        ? room.startDate.split("T")[0]
        : new Date(room.startDate).toISOString().split("T")[0]
      : undefined,
  }));
}
