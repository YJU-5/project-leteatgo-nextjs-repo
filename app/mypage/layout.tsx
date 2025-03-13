import { ReactNode } from 'react';
import Sidebar from './Sidebar/Sidebar';

export default function Layout({ children}: { children: ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '18%', padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}