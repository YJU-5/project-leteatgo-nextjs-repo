import { ReactNode } from 'react';
import Sidebar from './Sidebar/Sidebar';

export default function Layout({ children}: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', }}>
      <Sidebar />
      <div style={{ marginLeft: '30vh',width:"100%"}}>{children}</div>
    </div>
  );
}