import { ReactNode } from 'react';
import Sidebar from './Sidebar/Sidebar';

export default function Layout({ children}: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '20px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
}