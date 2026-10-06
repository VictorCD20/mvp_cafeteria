'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toast } from '../ui/Toast';
import { FloatingAssistant } from '../bot/FloatingAssistant';
import { useCodia } from '../../context/CodiaContext';
import { X } from 'lucide-react';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { activeTab } = useCodia();
  const mainRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cada módulo se abre desde arriba (no hereda el scroll del módulo anterior).
  // El menú móvil se cierra desde el propio Sidebar (onSelect) al elegir un módulo.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  // Tecla Escape para cerrar el menú móvil
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Drawer Móvil (pantallas < 768px) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer container */}
          <div className="relative w-[18rem] max-w-[calc(100vw-3rem)] bg-slate-100 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3 flex justify-end border-b border-slate-200">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Cerrar menú"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar isMobile onSelect={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen((v) => !v)} isMobileMenuOpen={isMobileMenuOpen} />
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 lg:px-10 lg:pt-10">{children}</div>
        </main>
      </div>

      {/* Global Toast Notification */}
      <Toast />

      {/* Asistente flotante (mini chat) */}
      <FloatingAssistant />
    </div>
  );
};
