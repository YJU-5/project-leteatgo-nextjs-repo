import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const token = localStorage.getItem('jwtToken')

const socket = io('http://localhost:3001/chat-room/join', {
    transports: ['websocket'], // WebSocket만 사용 (보안 Http 풀링방지)
    withCredentials: true,
    auth: {
        token: token
    }
})
export const useChat = (roomId: string) => {
    const [messages, setMessages] = useState<string[]>([])
    const [participants, setParticipants] = useState([])

    console.log(participants);

    useEffect(() => {
        // 채팅방 참여 
        socket.emit('joinRoom', roomId)

        // 채팅목록 가져오기 
        socket.emit('getMessages',roomId)

        // 채팅방 참여자 목록 가져오기 이벤트 요청  
        socket.emit('getRoomParticipants',roomId)

        // 서버에서 응답받은 참여자 목록 
        // 이름, 역할, 사진, 자기소개, id 
        // @@@@@@@@@@@@@@@@@@@@
        socket.on('roomParticipants',(users)=>{
            console.log(users);
        })

        socket.on('messages',(msg)=>{
            setMessages((prev)=>[...prev, ...msg])
        })

        // 메세지 수신
        socket.on('message', (msg) => {
            console.log(msg);
            setMessages((prev) => [...prev, msg])
        })
        
    }, [roomId])

    // 메세지 보내기 
    const sendMessage = (msg: string) => {
        socket.emit('message', { roomId, message: msg })
    }

    // 채팅방 나가기 나가고 나서 메인페이지로
    const leaveRoom=()=>{
        socket.emit('leaveRoom',{ roomId })
    }

    return { messages, sendMessage, leaveRoom }

}