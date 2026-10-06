'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView = () => {
  const { sales, expenses, employees, showToast } = useCodia();
  const [period, setPeriod] = useState<'diario' | 'semanal' | 'mensual'>('diario');

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.total, 0);
  const ticketSales = sales.filter((s) => !s.isShiftSummary);
  const ticketTotal = ticketSales.reduce((acc, s) => acc + s.total, 0);

  const handleExport = (type: string) => {
    showToast(`Reporte ${type} exportado en CSV/PDF (Simulado)`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Period Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Reportes & Métricas del Negocio</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Visualización consolidada de ventas, gastos, asistencia y cliente consentido.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex space-x-1">
            {(['diario', 'semanal', 'mensual'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap capitalize transition ${
                  period === p
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExport(period)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Report Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
              <TrendingUp className="w-5 h-5" />
              <span>Reporte de Ventas</span>
            </div>
            <span className="text-xs font-bold text-slate-400 capitalize">{period}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Monto Acumulado:</span>
              <span className="font-extrabold text-slate-900 dark:text-white">${totalSales.toLocaleString('es-MX')} MXN</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Transacciones Totales:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{ticketSales.length} ticket(s)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Ticket Promedio:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                ${ticketSales.length > 0 ? Math.round(ticketTotal / ticketSales.length) : 0} MXN
              </span>
            </div>
          </div>
        </div>

        {/* Expenses Report Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
              <FileSpreadsheet className="w-5 h-5" />
              <span>Reporte de Egresos</span>
            </div>
            <span className="text-xs font-bold text-slate-400 capitalize">{period}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Gastos Totales:</span>
              <span className="font-extrabold text-rose-600">${totalExpenses.toLocaleString('es-MX')} MXN</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Comprobantes OCR:</span>
              <span className="font-bold text-purple-600">
                {expenses.filter((e) => e.ocrScanned).length} procesados
              </span>
            </div>
          </div>
        </div>

        {/* Staff Attendance Report Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm">
              <Users className="w-5 h-5" />
              <span>Reporte de Personal</span>
            </div>
            <span className="text-xs font-bold text-slate-400 capitalize">{period}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Plantilla Activa:</span>
              <span className="font-bold text-slate-900 dark:text-white">{employees.length} empleados</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Checador Hikvision:</span>
              <span className="font-bold text-emerald-600">100% Operativo Simulado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
