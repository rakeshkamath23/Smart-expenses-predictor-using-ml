import React, { useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="dashboard-viewport">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        minWidth: 0
      }}>
        <Outlet />
      </div>
      <style>{`
        .dashboard-viewport {
          min-height: calc(100vh - 72px);
          width: 100%;
          padding: 2rem 1.5rem 3.5rem;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .dashboard-viewport {
            padding: 1.25rem 1rem 3rem;
          }
        }
        @media (max-width: 420px) {
          .dashboard-viewport {
            padding: 1rem 0.65rem 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}

