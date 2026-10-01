'use client';

import React from 'react';
import { useCodia } from '../../context/CodiaContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  Gift,
  FileCheck2,
  Clock,
  ShoppingCart,
  ArrowRight,
  Package,
  Receipt,
  CheckCircle2,
  Heart
} from 'lucide-react';

export const DashboardView = () => {
  const {
    sales,
    expenses,
    attendance,
    employees,
    ingredients,
    clients,
    setActiveTab,
    setSubTab
  } = useCodia();

  // Metrics calculation
  const ticketSales = sales.filter((s) => !s.isShiftSummary);
  const totalSalesToday = ticketSales.reduce((acc, s) => acc + s.total, 0);
  const totalExpensesToday = expenses.reduce((acc, e) => acc + e.total, 0);
  const netBalance = totalSalesToday - totalExpensesToday;

  const presentCount = attendance.filter((a) => a.status === 'puntual' || a.status === 'retardo').length;
  const lateCount = attendance.filter((a) => a.status === 'retardo').length;
  const absentCount = attendance.filter((a) => a.status === 'ausente').length;

  const lowStockItems = ingredients.filter((i) => i.currentStock <= i.minStock);
  const rewardsAvailableCount = clients.filter((c) => c.rewardsAvailable > 0).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-1">
              Resumen Operativo del Día
            </div>
            <h1 className="text-2xl font-black text-white">¡Buenas tardes, Laura! ☕</h1>
            <p className="text-slate-300 text-sm mt-1">
              Aquí está la visión general de la cafetería en tiempo real.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('ventas')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Punto de Venta</span>
            </button>
            <button
              onClick={() => setActiveTab('finanzas')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center space-x-2"
            >
              <Receipt className="w-4 h-4 text-blue-400" />
              <span>Egresos & OCR</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ventas del Día
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${totalSalesToday.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <span className="font-semibold text-emerald-600">{ticketSales.length} ventas</span>
              <span>registradas</span>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Gastos / Egresos
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${totalExpensesToday.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{expenses.length} comprobantes</span>
            </div>
          </div>
        </div>

        {/* Present Employees Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Personal Presente
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {presentCount} / {employees.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
              <span className="text-amber-500 font-semibold">{lateCount} retardo</span>
              <span>•</span>
              <span className="text-rose-500 font-semibold">{absentCount} falta</span>
            </div>
          </div>
        </div>

        {/* Rewards Available Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Recompensas Listas
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {rewardsAvailableCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Clientes listos para canje en Wallet
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Attention Required & Quick Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Alertas de Stock Bajo ({lowStockItems.length})
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('inventario')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center space-x-1"
              >
                <span>Ver Inventario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lowStockItems.length > 0 ? (
              <div className="space-y-2.5">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Categoría: <span className="capitalize">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-[11px] text-slate-400">Mínimo: {item.minStock} {item.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                Todo el inventario está en niveles óptimos.
              </div>
            )}
          </div>

          {/* Recent Sales Overview */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Últimas Ventas Registradas</span>
              </h2>
              <button
                onClick={() => setActiveTab('ventas')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Ir a POS
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Folio</th>
                    <th className="pb-3">Hora</th>
                    <th className="pb-3">Productos</th>
                    <th className="pb-3">Método</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ticketSales.slice(0, 4).map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {sale.folio}
                      </td>
                      <td className="py-3 text-slate-500">{sale.timestamp}</td>
                      <td className="py-3 text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">
                        {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </td>
                      <td className="py-3">
                        <span className="capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-semibold">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                        ${sale.total} MXN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Attendance Today & Fast Loyalty Status */}
        <div className="space-y-6">
          {/* Today's Staff Attendance Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span>Asistencia de Hoy</span>
              </h2>
              <button
                onClick={() => setActiveTab('empleados')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Ver Checador
              </button>
            </div>

            <div className="space-y-3">
              {employees.map((emp) => {
                const att = attendance.find((a) => a.employeeId === emp.id);
                return (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-slate-400 capitalize">{emp.role}</div>
                      </div>
                    </div>

                    <div>
                      {att ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            att.status === 'puntual'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : att.status === 'retardo'
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}
                        >
                          {att.status} {att.checkIn ? `(${att.checkIn})` : ''}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                          Sin Registro
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cliente Consentido Quick Status */}
          <div className="bg-gradient-to-tr from-purple-900 to-indigo-900 text-white p-6 rounded-2xl border border-purple-800 shadow-lg">
            <div className="flex items-center space-x-2 text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4 text-purple-300" />
              <span>Cliente Consentido</span>
            </div>
            <h3 className="text-lg font-bold">Fidelización de Clientes</h3>
            <p className="text-xs text-purple-200 mt-1">
              {clients.length} clientes registrados en la wallet simulada.
            </p>

            <button
              onClick={() => setActiveTab('cliente_consentido')}
              className="mt-4 w-full bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold py-2.5 rounded-xl shadow transition text-center"
            >
              Abrir Wallet & Tarjetas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
