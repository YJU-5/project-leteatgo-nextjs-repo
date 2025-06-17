import { ReactNode } from 'react';
import Sidebar from '@/components/MyPage/Sidebar/Sidebar';

export default function Layout({ children}: { children: ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '18vw'}}>{children}</div>
    </div>
  );
}