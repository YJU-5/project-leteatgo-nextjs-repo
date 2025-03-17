import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:3001/chat-room/join',{
    transports:['websocket'], // WebSocket만 사용 (보안 Http 풀링방지)
    withCredentials:true,
    auth:{
        token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZHRqczEwMDRzZEBnbWFpbC5jb20iLCJuYW1lIjoi6rmA7ZiV7ISgIiwic29jaWFsSWQiOiIzOTM1MzI5NDc3IiwiZGVsZXRlZCI6ZmFsc2UsImlhdCI6MTc0MjA5NTQ1NiwiZXhwIjoxNzQyMzk3ODU2fQ.RZ8KFE3SeyjLC2ijeFdgqzNNj6k2eeDMStQeRxQh6VM' // localStorage.getItem('token')
    }
})

// 연결 종료 감지 
socket.on('disconnect',(reason)=>{
    console.log(`🔴 WebSocket 연결이 끊어졌습니다. 이유: ${reason}`);
})

// 웹소캣 에러 감지 
socket.on('connect_error',(error)=>{
    console.error('❌ WebSocket 연결 오류:', error.message);
})

export const useChat = (roomId:string)=>{
    const [messages, setMessages] = useState<string[]>([])

    useEffect(()=>{
        
        // 채팅방 참여 
        socket.emit('joinRoom',roomId)

        // 메세지 수신
        socket.on('message',(msg)=>{
            console.log(msg);
            setMessages((prev)=>[...prev,msg])
        })

        // 채팅방 나가기 
        return()=>{
            socket.emit('leaveRoom',roomId)
            socket.off('message')
        }
    },[roomId])

    // 메세지 보내기 
    const sendMessage = (msg:string)=>{
        socket.emit('message',{roomId,message:msg})
    }

    return {messages, sendMessage}

}