'use client';

import React, { useState } from 'react';
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
  CupSoda,
  Flame,
  Sparkles,
  Store,
  Smartphone,
  ChevronDown,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';
import { UserRole, Permission } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: 'amber' | 'emerald' | 'blue';
  badgeTitle?: string;
  requiredPermission?: Permission;
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
    config,
    activeTab,
    setActiveTab,
    setSubTab,
    ingredients,
    clients,
    currentUser,
    switchRole,
    hasPermission,
    demoUsers
  } = useCodia();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minStock).length;
  const rewardsAvailableCount = clients.filter((c) => c.rewardsAvailable > 0).length;

  const rawGroups: { label: string; items: NavItem[] }[] = [
    {
      label: 'Operación diaria',
      items: [
        { id: 'inicio', label: 'Inicio', icon: LayoutDashboard, requiredPermission: 'sales.view_own' },
        { id: 'ventas', label: 'Ventas (POS)', icon: ShoppingCart, requiredPermission: 'sales.create' },
        {
          id: 'inventario',
          label: 'Inventario y recetas',
          icon: Package,
          badge: lowStockCount > 0 ? String(lowStockCount) : undefined,
          badgeTone: 'amber',
          badgeTitle: `${lowStockCount} insumos con stock bajo`,
          requiredPermission: 'inventory.view'
        }
      ]
    },
    {
      label: 'Equipo y finanzas',
      items: [
        { id: 'empleados', label: 'Empleados y pre-nómina', icon: Users, requiredPermission: 'employees.view' },
        { id: 'finanzas', label: 'Finanzas y OCR', icon: CircleDollarSign, requiredPermission: 'reports.financial' },
        { id: 'reportes', label: 'Reportes', icon: BarChart3, requiredPermission: 'reports.operational' }
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
          badgeTitle: `${rewardsAvailableCount} recompensas listas para canje`,
          requiredPermission: 'customers.view'
        },
        { id: 'vista_cliente', label: 'Vista del cliente', icon: Smartphone }
      ]
    },
    {
      label: 'Herramientas',
      items: [
        {
          id: 'asistente',
          label: 'Asistente CODIA',
          icon: Bot,
          badge: 'IA',
          badgeTone: 'blue',
          badgeTitle: 'Asistente con respuestas automáticas',
          requiredPermission: 'reports.operational'
        },
        { id: 'configuracion', label: 'Configuración', icon: Settings, requiredPermission: 'settings.manage' }
      ]
    }
  ];

  // Filtrar módulos visibles según los permisos del usuario activo
  const groups = rawGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.requiredPermission || hasPermission(item.requiredPermission))
    }))
    .filter((group) => group.items.length > 0);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSubTab('');
    if (onSelect) onSelect();
  };

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  const roleLabelMap: Record<UserRole, string> = {
    superadmin: 'Superadministrador CODIA',
    administrador: 'Administradora',
    encargado: 'Encargado de Sucursal',
    empleado: 'Empleado / Cajero',
    cliente: 'Cliente'
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
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
          {config.appearance?.brandLogo === 'cup' && <CupSoda className="w-5 h-5" />}
          {config.appearance?.brandLogo === 'flame' && <Flame className="w-5 h-5" />}
          {config.appearance?.brandLogo === 'sparkles' && <Sparkles className="w-5 h-5" />}
          {config.appearance?.brandLogo === 'store' && <Store className="w-5 h-5" />}
          {(!config.appearance?.brandLogo || config.appearance?.brandLogo === 'coffee') && <Coffee className="w-5 h-5" />}
        </div>
        <div className="leading-tight min-w-0">
          <div className="font-bold text-slate-900 text-sm tracking-wide flex items-center gap-1.5 truncate">
            <span className="truncate">{config.appearance?.brandName || 'CODIA'}</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono shrink-0">BETA</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">{config.branchName}</div>
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

      {/* Selector de rol de demo y usuario activo */}
      <div className="p-3 border-t border-slate-200 shrink-0 relative bg-slate-50">
        <button
          type="button"
          onClick={() => setShowRoleMenu((v) => !v)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/70 transition-colors text-left"
          title="Cambiar rol para pruebas de la demo"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-100" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-blue-600 font-medium truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" />
                <span>{roleLabelMap[currentUser.role]}</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
        </button>

        {showRoleMenu && (
          <div className="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider">
              Simular Rol en Demo
            </div>
            <div className="space-y-1 mt-1">
              {demoUsers.map((user) => {
                const isSelected = currentUser.role === user.role;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleRoleChange(user.role)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{roleLabelMap[user.role]}</div>
                    </div>
                    {isSelected && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono">Activo</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
