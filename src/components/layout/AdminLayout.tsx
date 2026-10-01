'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toast } from '../ui/Toast';
import { useCodia } from '../../context/CodiaContext';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { activeTab } = useCodia();
  const mainRef = useRef<HTMLElement>(null);

  // Cada módulo se abre desde arriba (no hereda el scroll del módulo anterior).
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 py-8 lg:px-10 lg:py-10">{children}</div>
        </main>
      </div>

      {/* Global Toast Notification */}
      <Toast />
    </div>
  );
};
