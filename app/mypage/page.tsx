"use client"

import { useRouter } from "next/navigation";
import Sidebar from "./Siderbar/Sidebar";


export default function MyPage() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '20px', width: '100%' }}>
        <h1 style={{ color: '#fff' }}>MyPage</h1>
        <p style={{ color: '#a0a0a0' }}>
          기본 페이지입니다. 사이드바에서 원하는 메뉴를 선택하세요.
        </p>
      </div>
    </div>
  );
}