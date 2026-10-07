'use client';

import React from 'react';
import { CodiaProvider } from '../../context/CodiaContext';
import { CustomerView } from '../../components/customer/CustomerView';
import { Coffee, ShieldCheck } from 'lucide-react';

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
        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Vista de Cliente</span>
        </div>
      </header>

      <main className="my-auto py-6 flex justify-center">
        <CustomerView isStandalonePublic />
      </main>

      <footer className="max-w-md mx-auto w-full text-center text-[11px] text-slate-500 pt-4 border-t border-slate-800 shrink-0">
        Portal de Cliente Consentido · Sin acceso a operaciones administrativas
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
