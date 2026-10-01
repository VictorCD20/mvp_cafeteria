'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { SectionCard } from '../ui/PageHeader';
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  Gift,
  Clock,
  ShoppingCart,
  ArrowRight,
  Package,
  Receipt,
  CheckCircle2,
  Heart,
  ChevronDown,
  UserX
} from 'lucide-react';

const TIME_ZONE = 'America/Mexico_City';

const greetingFor = (date: Date) => {
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: 'numeric', hourCycle: 'h23' }).format(date));
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

/** Solo la hora de un timestamp ("2026-09-30 08:15" o "01/10/2026, 02:25 a.m."); la fecha completa queda en el tooltip. */
const timeOf = (timestamp: string) => {
  const match = timestamp.match(/\d{1,2}:\d{2}(\s?[ap]\.\s?m\.)?\s*$/i);
  return match ? match[0].trim() : timestamp;
};

const statusStyles: Record<string, string> = {
  puntual: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  retardo: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  ausente: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  justificado: 'bg-slate-500/10 text-slate-500'
};

const LinkButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1 whitespace-nowrap"
  >
    <span>{label}</span>
    <ArrowRight className="w-3.5 h-3.5" />
  </button>
);

export const DashboardView = () => {
  const { sales, expenses, attendance, employees, ingredients, clients, setActiveTab } = useCodia();
  const [showAllStaff, setShowAllStaff] = useState(false);

  // Métricas
  const ticketSales = sales.filter((s) => !s.isShiftSummary);
  const totalSalesToday = ticketSales.reduce((acc, s) => acc + s.total, 0);
  const totalExpensesToday = expenses.reduce((acc, e) => acc + e.total, 0);

  const presentCount = attendance.filter((a) => a.status === 'puntual' || a.status === 'retardo').length;
  const lateCount = attendance.filter((a) => a.status === 'retardo').length;
  const absentCount = attendance.filter((a) => a.status === 'ausente').length;

  const lowStockItems = ingredients.filter((i) => i.currentStock <= i.minStock);
  const clientsWithRewards = clients.filter((c) => c.rewardsAvailable > 0);
  const rewardsAvailableCount = clientsWithRewards.length;

  // Asistencia: primero quien requiere atención; el resto se despliega bajo demanda.
  const staff = employees.map((emp) => ({ emp, att: attendance.find((a) => a.employeeId === emp.id) }));
  const staffNeedingAttention = staff.filter(({ att }) => !att || att.status !== 'puntual');
  const staffOnTime = staff.filter(({ att }) => att?.status === 'puntual');

  const now = new Date();
  const rawDate = new Intl.DateTimeFormat('es-MX', { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const todayLabel = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const kpis = [
    {
      label: 'Ventas del día',
      value: `$${totalSalesToday.toLocaleString('es-MX')}`,
      unit: 'MXN',
      caption: `${ticketSales.length} ventas registradas`,
      icon: TrendingUp,
      tone: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      label: 'Gastos / egresos',
      value: `$${totalExpensesToday.toLocaleString('es-MX')}`,
      unit: 'MXN',
      caption: `${expenses.length} comprobantes`,
      icon: TrendingDown,
      tone: 'text-rose-500 bg-rose-500/10'
    },
    {
      label: 'Personal presente',
      value: `${presentCount} / ${employees.length}`,
      unit: '',
      caption: `${lateCount} retardo · ${absentCount} falta`,
      icon: Users,
      tone: 'text-blue-500 bg-blue-500/10'
    },
    {
      label: 'Recompensas listas',
      value: String(rewardsAvailableCount),
      unit: '',
      caption: 'Clientes listos para canje en Wallet',
      icon: Gift,
      tone: 'text-purple-500 bg-purple-500/10'
    }
  ];

  const attentionCount = lowStockItems.length + lateCount + absentCount + rewardsAvailableCount;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Bienvenida */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">Resumen operativo del día</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white" suppressHydrationWarning>
            ¡{greetingFor(now)}, Laura!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2" suppressHydrationWarning>
            {todayLabel} · Aquí está la visión general de la cafetería en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('ventas')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Punto de venta</span>
          </button>
          <button
            onClick={() => setActiveTab('finanzas')}
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2"
          >
            <Receipt className="w-4 h-4 text-blue-500" />
            <span>Egresos y OCR</span>
          </button>
        </div>
      </div>

      {/* Indicadores principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map(({ label, value, unit, caption, icon: Icon, tone }) => (
          <div key={label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`p-2 rounded-lg ${tone}`}>
                <Icon className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
            </div>
            <div className="text-xs text-slate-500 mt-2">{caption}</div>
          </div>
        ))}
      </div>

      {/* Atención + Cliente Consentido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard
          className="lg:col-span-2"
          title="Requiere tu atención"
          subtitle={attentionCount > 0 ? `${attentionCount} pendientes para hoy` : 'Sin pendientes por ahora'}
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
        >
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Stock bajo */}
            <div className="pb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" />
                  Alertas de stock bajo ({lowStockItems.length})
                </h3>
                <LinkButton label="Ver inventario" onClick={() => setActiveTab('inventario')} />
              </div>
              {lowStockItems.length > 0 ? (
                <ul className="space-y-2">
                  {lowStockItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 capitalize">Categoría: {item.category}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-[11px] text-slate-500">Mínimo: {item.minStock} {item.unit}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Todo el inventario está en niveles óptimos.
                </p>
              )}
            </div>

            {/* Personal */}
            <div className="py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserX className="w-4 h-4 text-rose-500 shrink-0" />
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{lateCount} retardo</span> y <span className="font-medium">{absentCount} falta</span> en el turno de hoy
                </div>
              </div>
              <LinkButton label="Ver checador" onClick={() => setActiveTab('empleados')} />
            </div>

            {/* Recompensas */}
            <div className="pt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Gift className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="text-sm text-slate-700 dark:text-slate-300 truncate">
                  <span className="font-medium">{rewardsAvailableCount} clientes</span> con recompensa por canjear
                  {clientsWithRewards.length > 0 && (
                    <span className="text-slate-500"> · {clientsWithRewards.map((c) => c.name).join(', ')}</span>
                  )}
                </div>
              </div>
              <LinkButton label="Ver clientes" onClick={() => setActiveTab('cliente_consentido')} />
            </div>
          </div>
        </SectionCard>

        <section className="bg-purple-50 border border-purple-200 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold uppercase tracking-wide">
            <Heart className="w-4 h-4" />
            <span>Cliente Consentido</span>
          </div>
          <h2 className="text-lg font-semibold text-purple-900 mt-3">Fidelización de clientes</h2>
          <p className="text-sm text-purple-700 mt-2 leading-relaxed">
            {clients.length} clientes registrados en la wallet simulada.
          </p>
          <div className="flex-1" />
          <button
            onClick={() => setActiveTab('cliente_consentido')}
            className="mt-6 w-full bg-purple-600 text-white hover:bg-purple-700 text-xs font-semibold py-2.5 rounded-lg transition-colors"
          >
            Abrir Wallet y tarjetas
          </button>
        </section>
      </div>

      {/* Actividad del día */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard
          className="lg:col-span-2"
          title="Últimas ventas registradas"
          icon={<ShoppingCart className="w-4 h-4 text-blue-500" />}
          action={<LinkButton label="Ir a POS" onClick={() => setActiveTab('ventas')} />}
        >
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="font-medium px-2 pb-3">Folio</th>
                  <th className="font-medium px-2 pb-3">Hora</th>
                  <th className="font-medium px-2 pb-3">Productos</th>
                  <th className="font-medium px-2 pb-3">Método</th>
                  <th className="font-medium px-2 pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ticketSales.slice(0, 4).map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-2 py-3.5 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{sale.folio}</td>
                    <td className="px-2 py-3.5 text-xs text-slate-500 whitespace-nowrap" title={sale.timestamp}>
                      {timeOf(sale.timestamp)}
                    </td>
                    <td
                      className="px-2 py-3.5 text-slate-700 dark:text-slate-300 max-w-[14rem] truncate"
                      title={sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    >
                      {sale.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="px-2 py-3.5">
                      <span className="capitalize text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-2 py-3.5 text-right font-semibold text-slate-900 dark:text-white whitespace-nowrap">${sale.total} MXN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Asistencia de hoy"
          subtitle={`${staffOnTime.length} puntuales · ${staffNeedingAttention.length} por revisar`}
          icon={<Clock className="w-4 h-4 text-indigo-500" />}
          action={<LinkButton label="Ver checador" onClick={() => setActiveTab('empleados')} />}
        >
          <ul className="space-y-3">
            {(showAllStaff ? [...staffNeedingAttention, ...staffOnTime] : staffNeedingAttention).map(({ emp, att }) => (
              <li key={emp.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{emp.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{emp.role}</div>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-medium px-2 py-1 rounded-full capitalize whitespace-nowrap ${
                    att ? statusStyles[att.status] : 'bg-slate-500/10 text-slate-500'
                  }`}
                >
                  {att ? `${att.status}${att.checkIn ? ` · ${att.checkIn}` : ''}` : 'Sin registro'}
                </span>
              </li>
            ))}
          </ul>
          {staffOnTime.length > 0 && (
            <button
              onClick={() => setShowAllStaff((v) => !v)}
              className="mt-5 w-full text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{showAllStaff ? 'Mostrar solo pendientes' : `Ver también ${staffOnTime.length} puntuales`}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllStaff ? 'rotate-180' : ''}`} />
            </button>
          )}
        </SectionCard>
      </div>
    </div>
  );
};
