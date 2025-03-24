import { ReactNode } from 'react';
import Sidebar from './sidebar/sidebar';

export default function Layout({ children}: { children: ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '18vw'}}>{children}</div>
    </div>
  );
}