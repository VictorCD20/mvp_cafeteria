'use client';

import React from 'react';
import { useCodia } from '../../context/CodiaContext';
import {
  Building2,
  CheckCircle,
  RotateCcw,
  PlusCircle,
  Bot,
  Zap,
  Clock,
  ShieldCheck,
  Bell
} from 'lucide-react';

export const Header = () => {
  const { config, setActiveTab, resetToSeedData } = useCodia();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Branch & Live Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-bold text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{config.cafeteriaName}</span>
          <span className="text-slate-400">|</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{config.branchName}</span>
        </div>

        {/* Integration Status Badges */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Hikvision Simulado</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>PAC CFDI Simulado</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons & Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveTab('ventas')}
          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Venta</span>
        </button>

        <button
          onClick={() => setActiveTab('asistente')}
          className="flex items-center space-x-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold px-3 py-2 rounded-xl transition"
        >
          <Bot className="w-4 h-4" />
          <span>Preguntar al Bot</span>
        </button>

        <button
          onClick={resetToSeedData}
          title="Reiniciar datos demo a estado original"
          className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>
    </header>
  );
};
