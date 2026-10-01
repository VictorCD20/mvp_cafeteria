'use client';

import React from 'react';
import { useCodia } from '../../context/CodiaContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useCodia();

  if (!toastMessage) return null;

  return (
    <div role="status" className="fixed top-20 right-6 z-[60] max-w-sm flex items-center space-x-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
      <span className="text-sm font-medium text-slate-100">{toastMessage}</span>
    </div>
  );
};
