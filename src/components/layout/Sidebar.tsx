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
  Sparkles,
  AlertTriangle,
  Gift
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, setSubTab, ingredients, clients } = useCodia();

  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minStock).length;
  const rewardsAvailableCount = clients.filter((c) => c.rewardsAvailable > 0).length;

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'ventas', label: 'Ventas (POS)', icon: ShoppingCart },
    {
      id: 'inventario',
      label: 'Inventario & Recetas',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} bajo` : undefined,
      badgeColor: 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
    },
    { id: 'empleados', label: 'Empleados & Pre-nómina', icon: Users },
    { id: 'finanzas', label: 'Finanzas & OCR', icon: CircleDollarSign },
    {
      id: 'cliente_consentido',
      label: 'Cliente Consentido',
      icon: Heart,
      badge: rewardsAvailableCount > 0 ? `${rewardsAvailableCount} listo` : undefined,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
    },
    { id: 'asistente', label: 'Asistente CODIA', icon: Bot, isNew: true },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icon: Settings }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSubTab('');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3 bg-slate-950/40">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl">
          <Coffee className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-white text-base tracking-wide flex items-center space-x-1">
            <span>CODIA</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono font-semibold">
              POS
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Gestión Cafetería</p>
        </div>
      </div>

      {/* Profile Active Banner */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center space-x-3">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Laura Méndez"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/50"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-bold text-white truncate">Laura Méndez</div>
          <div className="text-[11px] text-blue-400 font-semibold truncate flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-blue-400 inline shrink-0" />
            <span>Administradora</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          Módulos Principales
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
              {item.isNew && (
                <span className="text-[10px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  IA
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-500 text-center">
        <div className="font-semibold text-slate-400">CODIA Cafetería v0.1</div>
        <div className="text-[11px] text-slate-500">Demo Funcional Integral</div>
      </div>
    </aside>
  );
};
