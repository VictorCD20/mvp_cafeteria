'use client';

import React from 'react';
import { CodiaProvider } from '../../context/CodiaContext';
import { CustomerView } from '../../components/customer/CustomerView';
import { Coffee, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function PublicCustomerApp() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 font-sans">
      <header className="max-w-md mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">CODIA Cafetería</div>
            <div className="text-[11px] text-purple-400 font-medium">Tarjeta digital demo (Pública)</div>
          </div>
        </div>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Panel Admin</span>
        </Link>
      </header>

      <main className="my-auto py-6 flex justify-center">
        <CustomerView isStandalonePublic />
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-slate-500 pt-4 border-t border-slate-800 shrink-0">
        Demostración interactiva de Tarjeta Digital · Sin backend real · Datos ficticios
      </footer>
    </div>
  );
}

export default function ClientePage() {
  return (
    <CodiaProvider>
      <PublicCustomerApp />
    </CodiaProvider>
  );
}
