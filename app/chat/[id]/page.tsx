"use client";

import { useParams } from "next/navigation";

export default function ChatRoom() {
  const params = useParams();
  const chatId = params.id;

  return (
    <div>
      <h1>채팅방 {chatId}</h1>
    </div>
  );
}
