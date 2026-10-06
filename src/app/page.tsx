'use client';

import React from 'react';
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
  const { activeTab, currentUser } = useCodia();

  if (!currentUser) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'inicio':
        return <DashboardView />;
      case 'ventas':
        return <PosView />;
      case 'inventario':
        return <InventoryView />;
      case 'empleados':
        return <EmployeesView />;
      case 'finanzas':
        return <FinancesView />;
      case 'cliente_consentido':
        return <LoyaltyView />;
      case 'vista_cliente':
        return <CustomerView />;
      case 'asistente':
        return <BotView />;
      case 'reportes':
        return <ReportsView />;
      case 'configuracion':
        return <SettingsView />;
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
