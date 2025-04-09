import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const token = localStorage.getItem('jwtToken') // jwt토큰을 가져온다 

// 소켓에 연결할 주소와 거기에 보내줄 데이터들 
const socket = io('http://localhost:3001/chat-room/join', {
    transports: ['websocket'], // WebSocket만 사용 (보안 Http 풀링방지)
    withCredentials: true,
    auth: {
        token: token // jwt 토큰 
    }
})

export const useChat = (roomId: string) => {
    // 메세지 목록 
    const [messages, setMessages] = useState<string[]>([])
    // 채팅 참여자 목록 
    const [participants, setParticipants] = useState([])
    // 개최자인지 아닌지 저장 
    const [role, setRole] = useState('') 

    useEffect(() => {
        // 채팅방 참여이벤트와 roomId를 메세지로 백엔드서버에 전송
        socket.emit('joinRoom', roomId)

        // 채팅목록 가져오기 
        socket.emit('getMessages',roomId)

        // 채팅방 참여자 목록 가져오기 이벤트 요청  
        socket.emit('getRoomParticipants',roomId)

        // 서버에서 응답받은 참여자 목록 
        // 이름, 역할, 사진, 자기소개, id 
        // 배열로 저장할 필요가 있음
        socket.on('roomParticipants',(users)=>{
            console.log(users);
        })

        // 유저 역할 이벤트 받고 저장 
        socket.on('role',(role)=>{
            setRole(role)
        })

        // DB에 저장되어있는 메세지 가져오기 
        socket.on('messages',(msg)=>{
            setMessages((prev)=>[...prev, ...msg])
        })

        // 유저, 백엔드가 보내는 메세지 이벤트 저장 
        socket.on('message', (msg) => {
            console.log(msg);
            setMessages((prev) => [...prev, msg])
        })
        
    }, [roomId])

    // 메세지 보내기 
    const sendMessage = (msg: string) => {
        // 메세지 이벤트 전송 
        socket.emit('message', { roomId, message: msg })
    }

    // 채팅방 나가기 나가고 나서 메인페이지로
    const leaveRoom=()=>{
        socket.emit('leaveRoom',{ roomId })
    }

    const requestReview=()=>{
        socket.emit('requestReview',{roomId})
    }

    return { messages, role, sendMessage, leaveRoom, requestReview }

}