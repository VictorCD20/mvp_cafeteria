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
  LucideIcon
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: 'amber' | 'emerald' | 'blue';
  badgeTitle?: string;
}

const badgeTones = {
  amber: 'bg-amber-500/15 text-amber-400',
  emerald: 'bg-emerald-500/15 text-emerald-400',
  blue: 'bg-blue-500/20 text-blue-300'
};

export const Sidebar = () => {
  const { activeTab, setActiveTab, setSubTab, ingredients, clients } = useCodia();

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

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSubTab('');
  };

  return (
    <aside className="w-[17rem] bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen border-r border-slate-800">
      {/* Marca */}
      <div className="px-5 h-16 border-b border-slate-800 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
          <Coffee className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-white text-sm tracking-wide flex items-center gap-1.5">
            <span>CODIA</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">POS</span>
          </div>
          <div className="text-[11px] text-slate-500">Gestión de cafetería</div>
        </div>
      </div>

      {/* Navegación agrupada */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6" aria-label="Módulos">
        {groups.map((group) => (
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
                      isActive ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        title={item.badgeTitle}
                        className={`text-[10px] min-w-5 text-center px-1.5 py-0.5 rounded-full font-semibold ${
                          isActive ? 'bg-white/20 text-white' : badgeTones[item.badgeTone ?? 'blue']
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

      {/* Usuario activo */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-3 shrink-0">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Laura Méndez"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="text-sm font-medium text-white truncate">Laura Méndez</div>
          <div className="text-[11px] text-slate-500 truncate">Administradora · v0.1 demo</div>
        </div>
      </div>
    </aside>
  );
};
