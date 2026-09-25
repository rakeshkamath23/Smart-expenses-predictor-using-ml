import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 70px)'
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        padding: '2.5rem',
        overflowY: 'auto',
        backgroundColor: 'transparent'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
