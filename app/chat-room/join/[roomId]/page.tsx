'use client'; // 클라이언트 컴포넌트로 설정

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useChat } from '@/hooks/useChat';

export default function ChatRoomPage() {
  const { roomId } = useParams(); // 동적 라우트 값
  const { messages, role, sendMessage, leaveRoom, requestReview } = useChat(roomId as string);
  const [input, setInput] = useState('');

  if(!roomId){
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
      <h2>유저역할 : { role ? role:""}</h2>
      <div style={{ border: '1px solid #ddd', padding: '10px', height: '300px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="메시지를 입력하세요" />
      <button onClick={() => { sendMessage(input); setInput(''); }}>전송</button>
      <button onClick={()=>{ leaveRoom()}}>채팅방 나가기</button>
      {/* 유저의 역할이 HOST일 경우 리뷰요청 버튼이 나타나고 USER일 경우 안나타남 */}
      {role === 'HOST' ? <button onClick={()=>{requestReview()}}>리뷰요청하기</button> : ""}
    </div>
  );
}
