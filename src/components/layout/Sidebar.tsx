'use client';

import React from 'react';
import { useCodia } from '../../context/CodiaContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  CircleDollarSign,
  Heart,
  Bot,
  BarChart3,
  Settings,
  Coffee,
  Smartphone,
  LogOut,
  LogIn,
  LucideIcon
} from 'lucide-react';
import { latestAttendanceByEmployee } from '../../lib/attendance';
import { todayInMexico } from '../../lib/dates';
import { ModuleId } from '../../types';

interface NavItem {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: 'amber' | 'emerald' | 'blue';
  badgeTitle?: string;
}

const badgeTones = {
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700'
};

interface SidebarProps {
  onSelect?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelect, isMobile }) => {
  const {
    activeTab,
    setActiveTab,
    ingredients,
    clients,
    can,
    currentUser,
    currentRole,
    logout,
    attendance,
    registerCheckIn,
    registerCheckOut
  } = useCodia();

  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minStock).length;
  const rewardsAvailableCount = clients.filter((c) => c.rewardsAvailable > 0).length;

  // Los módulos se agrupan por área para que el menú se lea de un vistazo.
  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: 'Operación diaria',
      items: [
        { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
        { id: 'ventas', label: 'Ventas (POS)', icon: ShoppingCart },
        {
          id: 'inventario',
          label: 'Inventario y recetas',
          icon: Package,
          badge: lowStockCount > 0 ? String(lowStockCount) : undefined,
          badgeTone: 'amber',
          badgeTitle: `${lowStockCount} insumos con stock bajo`
        }
      ]
    },
    {
      label: 'Equipo y finanzas',
      items: [
        { id: 'empleados', label: 'Empleados y pre-nómina', icon: Users },
        { id: 'finanzas', label: 'Finanzas y OCR', icon: CircleDollarSign },
        { id: 'reportes', label: 'Reportes', icon: BarChart3 }
      ]
    },
    {
      label: 'Clientes',
      items: [
        {
          id: 'cliente_consentido',
          label: 'Cliente Consentido',
          icon: Heart,
          badge: rewardsAvailableCount > 0 ? String(rewardsAvailableCount) : undefined,
          badgeTone: 'emerald',
          badgeTitle: `${rewardsAvailableCount} recompensas listas para canje`
        },
        { id: 'vista_cliente', label: 'Vista del cliente', icon: Smartphone }
      ]
    },
    {
      label: 'Herramientas',
      items: [
        { id: 'asistente', label: 'Asistente CODIA', icon: Bot, badge: 'IA', badgeTone: 'blue', badgeTitle: 'Asistente con respuestas automáticas' },
        { id: 'configuracion', label: 'Configuración', icon: Settings }
      ]
    }
  ];

  // Cada rol solo ve los módulos que tiene permitidos; los grupos vacíos se ocultan.
  const visibleGroups = groups
    .map((group) => ({ ...group, items: group.items.filter((item) => can(item.id)) }))
    .filter((group) => group.items.length > 0);

  // Checador propio: cualquier persona registra su entrada/salida desde su sesión.
  const myRecord = currentUser ? latestAttendanceByEmployee(attendance).get(currentUser.id) : undefined;
  const myToday = myRecord?.date === todayInMexico() ? myRecord : undefined;

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (onSelect) onSelect();
  };

  return (
    <aside
      className={
        isMobile
          ? 'w-full bg-slate-100 text-slate-600 flex flex-col h-full overflow-y-auto'
          : 'hidden md:flex w-[17rem] bg-slate-100 text-slate-600 flex flex-col shrink-0 h-screen border-r border-slate-200'
      }
    >
      {/* Marca */}
      <div className="px-5 h-16 border-b border-slate-200 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
          <Coffee className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-slate-900 text-sm tracking-wide flex items-center gap-1.5">
            <span>CODIA</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">POS</span>
          </div>
          <div className="text-[11px] text-slate-500">Gestión de cafetería</div>
        </div>
      </div>

      {/* Navegación agrupada */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6" aria-label="Módulos">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-white text-blue-800 font-medium shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        title={item.badgeTitle}
                        className={`text-[10px] min-w-5 text-center px-1.5 py-0.5 rounded-full font-semibold ${
                          isActive ? 'bg-blue-100 text-blue-700' : badgeTones[item.badgeTone ?? 'blue']
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Usuario activo, checador propio y cierre de sesión */}
      {currentUser && (
        <div className="p-4 border-t border-slate-200 space-y-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-100" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{currentRole?.name ?? 'Sin rol'} · v0.1 demo</div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex-1 text-slate-500 truncate">
              {myToday?.checkIn ? `Entrada ${myToday.checkIn}${myToday.checkOut ? ` · Salida ${myToday.checkOut}` : ''}` : 'Sin entrada hoy'}
            </span>
            {!myToday?.checkIn ? (
              <button
                type="button"
                onClick={() => registerCheckIn(currentUser.id)}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1 rounded-lg"
              >
                <LogIn className="w-3.5 h-3.5" /> Entrada
              </button>
            ) : (
              !myToday.checkOut && (
                <button
                  type="button"
                  onClick={() => registerCheckOut(currentUser.id)}
                  className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-2.5 py-1 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" /> Salida
                </button>
              )
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
