'use client';

import React, { useState } from 'react';
import { CodiaProvider, useCodia } from '../context/CodiaContext';
import { LoginView } from '../components/login/LoginView';
import { AdminLayout } from '../components/layout/AdminLayout';
import { DashboardView } from '../components/dashboard/DashboardView';
import { EmployeesView } from '../components/employees/EmployeesView';
import { InventoryView } from '../components/inventory/InventoryView';
import { PosView } from '../components/pos/PosView';
import { FinancesView } from '../components/finances/FinancesView';
import { LoyaltyView } from '../components/loyalty/LoyaltyView';
import { CustomerView } from '../components/customer/CustomerView';
import { BotView } from '../components/bot/BotView';
import { ReportsView } from '../components/reports/ReportsView';
import { SettingsView } from '../components/settings/SettingsView';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const { activeTab, currentUser, hasPermission, switchRole } = useCodia();

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderActiveView = () => {
    // Si el rol activo es cliente, aislar la vista y no renderizar controles de administración
    if (currentUser.role === 'cliente') {
      return (
        <div className="p-6 max-w-2xl mx-auto space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 p-4 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <span className="font-bold">Sesión en Modo Cliente:</span> Acceso administrativo bloqueado.
            </div>
            <button
              onClick={() => switchRole('administrador')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors shadow"
            >
              Cambiar a Administradora
            </button>
          </div>
          <CustomerView isStandalonePublic />
        </div>
      );
    }

    switch (activeTab) {
      case 'inicio':
        return <DashboardView />;
      case 'ventas':
        return hasPermission('sales.create') || hasPermission('sales.view_own') ? <PosView /> : <DashboardView />;
      case 'inventario':
        return hasPermission('inventory.view') ? <InventoryView /> : <DashboardView />;
      case 'empleados':
        return hasPermission('employees.view') || hasPermission('attendance.review') ? <EmployeesView /> : <DashboardView />;
      case 'finances':
      case 'finanzas':
        return hasPermission('reports.financial') ? <FinancesView /> : <DashboardView />;
      case 'cliente_consentido':
        return hasPermission('customers.view') || hasPermission('loyalty.redeem') ? <LoyaltyView /> : <DashboardView />;
      case 'vista_cliente':
        return <CustomerView />;
      case 'asistente':
        return hasPermission('reports.operational') || hasPermission('sales.view_branch') || hasPermission('settings.manage') ? <BotView /> : <DashboardView />;
      case 'reportes':
        return hasPermission('reports.operational') || hasPermission('reports.financial') ? <ReportsView /> : <DashboardView />;
      case 'configuracion':
        return hasPermission('settings.manage') ? <SettingsView /> : <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return <AdminLayout>{renderActiveView()}</AdminLayout>;
}

export default function Home() {
  return (
    <CodiaProvider>
      <AppContent />
    </CodiaProvider>
  );
}
