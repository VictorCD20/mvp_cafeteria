'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Employee,
  Ingredient,
  Product,
  Recipe,
  Sale,
  Expense,
  Client,
  Promotion,
  AttendanceRecord,
  PrePayrollRecord,
  SystemConfig,
  InventoryMovement,
  InventoryMovementType,
  LoyaltyMovement,
  LoyaltyMovementType,
  AuditLogEntry,
  AuditActionType,
  InvoiceSimulated,
  BotMessage,
  ActiveUser,
  UserRole,
  Permission
} from '../types';

import codiaBetaConfig from '../config/codia-beta.json';

import {
  initialConfig,
  initialEmployees,
  initialIngredients,
  initialProducts,
  initialRecipes,
  initialClients,
  initialPromotions,
  initialAttendance,
  initialSales,
  initialExpenses,
  initialMovements,
  initialLoyaltyMovements,
  initialAuditLogs
} from '../data/seedData';
import { quoteSale } from '../lib/promotions';
import { findShortages, requiredIngredients } from '../lib/inventory';

export const demoUsers: ActiveUser[] = [
  {
    id: 'usr-admin',
    name: 'Laura Méndez',
    email: 'laura.mendez@codia.com',
    role: 'administrador',
    employeeId: 'emp-1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    branchId: 'branch-main'
  },
  {
    id: 'usr-encargado',
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@codia.com',
    role: 'encargado',
    employeeId: 'emp-5',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branchId: 'branch-main'
  },
  {
    id: 'usr-cajero',
    name: 'Luis García',
    email: 'luis.garcia@codia.com',
    role: 'empleado',
    employeeId: 'emp-3',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    branchId: 'branch-main'
  },
  {
    id: 'usr-superadmin',
    name: 'Soporte Técnico CODIA',
    email: 'admin@codia.com',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    branchId: 'branch-main'
  },
  {
    id: 'usr-cliente',
    name: 'Mariana Ríos',
    email: 'mariana.rios@gmail.com',
    role: 'cliente',
    clientId: 'cli-1',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    branchId: 'branch-main'
  }
];

interface CodiaContextType {
  config: SystemConfig;
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  
  // Auth & Roles
  currentUser: ActiveUser;
  setCurrentUser: (user: ActiveUser) => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: Permission) => boolean;
  demoUsers: ActiveUser[];

  // Navigation State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  subTab: string;
  setSubTab: (sub: string) => void;
  
  // Employee & Attendance & Payroll
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id' | 'code'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  attendance: AttendanceRecord[];
  registerCheckIn: (employeeId: string, status?: 'puntual' | 'retardo') => void;
  registerCheckOut: (employeeId: string) => void;
  justifyAbsence: (employeeId: string, notes: string) => void;
  getPrePayroll: () => PrePayrollRecord[];
  
  // Inventory & Recipes
  ingredients: Ingredient[];
  addIngredient: (ing: Omit<Ingredient, 'id'>) => void;
  updateIngredientStock: (id: string, newStock: number, reason: string) => void;
  recordInventoryMovement: (data: {
    ingredientId: string;
    type: InventoryMovementType;
    quantity: number;
    reason: string;
    saleFolio?: string;
    costImpact?: number;
  }) => boolean;
  products: Product[];
  addProduct: (prod: Omit<Product, 'id' | 'code'>) => void;
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  movements: InventoryMovement[];

  // POS & Sales
  sales: Sale[];
  registerSale: (
    items: { product: Product; quantity: number }[],
    paymentMethod: 'efectivo' | 'tarjeta',
    clientId?: string,
    options?: { forceFriday?: boolean }
  ) => { success: boolean; folio: string; message: string };

  // Finances & OCR & Invoicing
  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id' | 'folio'>) => void;
  simulateOcrScan: (fileOrMockName: string) => Promise<Omit<Expense, 'id' | 'folio'>>;
  invoices: InvoiceSimulated[];
  requestInvoice: (saleFolio: string, rfc: string, businessName: string, taxEmail: string) => InvoiceSimulated;

  // Loyalty & Wallet & Promotions
  clients: Client[];
  addClient: (client: { name: string; email: string; phone: string; avatar?: string }) => Client;
  addStampsToClient: (clientId: string, count: number, amountSpent?: number, saleFolio?: string) => void;
  redeemReward: (clientId: string) => boolean;
  loyaltyMovements: LoyaltyMovement[];
  addLoyaltyMovement: (movement: Omit<LoyaltyMovement, 'id' | 'timestamp' | 'responsibleUserId' | 'responsibleUserName'> & {
    responsibleUserId?: string;
    responsibleUserName?: string;
  }) => void;
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  togglePromotion: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  logAuditEvent: (
    action: AuditActionType,
    description: string,
    targetEntity?: string,
    targetId?: string,
    details?: Record<string, any>
  ) => void;

  // Bot Assistant
  botMessages: BotMessage[];
  sendBotMessage: (userText: string) => void;

  // Notification / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Reset demo
  resetToSeedData: () => void;
}

const CodiaContext = createContext<CodiaContextType | undefined>(undefined);

export const CodiaProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SystemConfig>(initialConfig);
  const [activeTab, setActiveTabState] = useState<string>('inicio');
  const [subTab, setSubTabState] = useState<string>('');

  const validTabs = [
    'inicio',
    'ventas',
    'inventario',
    'empleados',
    'finances',
    'finanzas',
    'cliente_consentido',
    'vista_cliente',
    'asistente',
    'reportes',
    'configuracion'
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const subParam = params.get('subTab') || params.get('sub') || '';

      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTabState(tabParam);
        setSubTabState(subParam);
      } else if (!tabParam) {
        setActiveTabState('inicio');
        setSubTabState('');
      } else {
        // URL inválida -> destino seguro inicio
        setActiveTabState('inicio');
        setSubTabState('');
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    syncFromUrl();

    const onPopState = () => syncFromUrl();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const updateUrlNav = (newTab: string, newSub: string) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (newTab && newTab !== 'inicio') params.set('tab', newTab);
    if (newSub) params.set('sub', newSub);

    const queryString = params.toString();
    const targetQuery = queryString ? `?${queryString}` : '';
    const newUrl = `${window.location.pathname}${targetQuery}`;
    if (window.location.search !== targetQuery) {
      window.history.pushState({ tab: newTab, sub: newSub }, '', newUrl);
    }
  };

  const setActiveTab = (tab: string) => {
    const targetTab = validTabs.includes(tab) ? tab : 'inicio';
    setActiveTabState(targetTab);
    setSubTabState('');
    updateUrlNav(targetTab, '');
  };

  const setSubTab = (sub: string) => {
    setSubTabState(sub);
    updateUrlNav(activeTab, sub);
  };

  const [currentUser, setCurrentUser] = useState<ActiveUser>(demoUsers[0]);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [movements, setMovements] = useState<InventoryMovement[]>(initialMovements);
  const [loyaltyMovements, setLoyaltyMovements] = useState<LoyaltyMovement[]>(initialLoyaltyMovements);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [invoices, setInvoices] = useState<InvoiceSimulated[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    const roleData = codiaBetaConfig.roles[currentUser.role as keyof typeof codiaBetaConfig.roles];
    if (!roleData) return false;
    const perms = (roleData.permissions as string[]) || [];
    return perms.includes('*') || perms.includes(permission);
  };

  const logAuditEvent = (
    action: AuditActionType,
    description: string,
    targetEntity?: string,
    targetId?: string,
    details?: Record<string, any>
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newEntry: AuditLogEntry = {
      id: `audit-${now.getTime()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      action,
      description,
      responsibleUserId: currentUser.id,
      responsibleUserName: currentUser.name,
      responsibleRole: currentUser.role,
      targetEntity,
      targetId,
      details
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const addLoyaltyMovement = (
    movement: Omit<LoyaltyMovement, 'id' | 'timestamp' | 'responsibleUserId' | 'responsibleUserName'> & {
      responsibleUserId?: string;
      responsibleUserName?: string;
    }
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMov: LoyaltyMovement = {
      id: `loy-mov-${now.getTime()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      clientId: movement.clientId,
      clientName: movement.clientName,
      type: movement.type,
      stampsDelta: movement.stampsDelta,
      rewardsDelta: movement.rewardsDelta,
      previousStamps: movement.previousStamps,
      newStamps: movement.newStamps,
      previousRewards: movement.previousRewards,
      newRewards: movement.newRewards,
      reason: movement.reason,
      saleFolio: movement.saleFolio,
      responsibleUserId: movement.responsibleUserId || currentUser.id,
      responsibleUserName: movement.responsibleUserName || currentUser.name
    };

    setLoyaltyMovements((prev) => [newMov, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = demoUsers.find((u) => u.role === role) || {
      id: `usr-${role}`,
      name: `Usuario ${role}`,
      email: `${role}@codia.com`,
      role: role,
      branchId: 'branch-main'
    };
    const prevRole = currentUser.role;
    const prevName = currentUser.name;
    setCurrentUser(targetUser);

    logAuditEvent(
      'cambio_rol',
      `Cambio de perfil/rol activo de ${prevRole} (${prevName}) a ${role} (${targetUser.name})`,
      'usuario',
      targetUser.id,
      { previousRole: prevRole, newRole: role, switchedToUser: targetUser.name }
    );

    if (role === 'cliente') {
      setActiveTab('vista_cliente');
    } else if (role === 'empleado' && ['finanzas', 'finances', 'empleados', 'configuracion', 'reportes'].includes(activeTab)) {
      setActiveTab('ventas');
    } else if (role === 'encargado' && ['finanzas', 'finances', 'configuracion'].includes(activeTab)) {
      setActiveTab('inicio');
    }
    showToast(`Rol activo cambiado a: ${targetUser.name} (${role})`);
  };

  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    {
      id: 'bot-1',
      sender: 'bot',
      text: '¡Hola Laura! Soy tu Asistente Virtual CODIA. Puedo responder preguntas sobre ventas del día, inventario bajo, retardos y faltas, gastos, clientes con recompensa y promociones.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const updateConfig = (newCfg: Partial<SystemConfig>) => {
    if (!hasPermission('settings.manage')) {
      showToast('Permiso denegado: Se requiere permiso de configuración');
      return;
    }
    setConfig((prev) => ({ ...prev, ...newCfg }));
    logAuditEvent('configuracion', 'Actualización de parámetros operativos del sistema', 'configuracion', undefined, newCfg);
    showToast('Configuración del sistema actualizada');
  };

  // Employees
  const addEmployee = (empData: Omit<Employee, 'id' | 'code'>) => {
    if (!hasPermission('employees.manage')) {
      showToast('Permiso denegado: Se requiere permiso para administrar personal');
      return;
    }
    const id = `emp-${Date.now()}`;
    const code = `EMP-00${employees.length + 1}`;
    const newEmp: Employee = { id, code, ...empData };
    setEmployees((prev) => [...prev, newEmp]);
    logAuditEvent('modificacion_empleado', `Alta de nuevo empleado: ${newEmp.name} (${code})`, 'empleado', id, { ...empData });
    showToast(`Empleado ${newEmp.name} registrado con éxito`);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    if (!hasPermission('employees.manage')) {
      showToast('Permiso denegado: Se requiere permiso para modificar personal');
      return;
    }
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...empData } : e)));
    logAuditEvent('modificacion_empleado', `Actualización de datos de empleado ${id}`, 'empleado', id, empData);
    showToast('Datos de empleado actualizados');
  };

  // Attendance
  const registerCheckIn = (employeeId: string, statusOverride?: 'puntual' | 'retardo') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setAttendance((prev) => {
      const existingIndex = prev.findIndex((a) => a.employeeId === employeeId && a.date === todayStr);
      const emp = employees.find((e) => e.id === employeeId);
      const status = statusOverride || (timeStr > '07:15' ? 'retardo' : 'puntual');

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          checkIn: timeStr,
          status: status
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: `att-${Date.now()}`,
            employeeId,
            date: todayStr,
            checkIn: timeStr,
            status,
            deviceSimulated: 'Hikvision DS-K1T804AM'
          }
        ];
      }
    });
    const emp = employees.find((e) => e.id === employeeId);
    showToast(`Asistencia entrada registrada para ${emp?.name || 'Empleado'}`);
  };

  const registerCheckOut = (employeeId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setAttendance((prev) =>
      prev.map((a) => (a.employeeId === employeeId && a.date === todayStr ? { ...a, checkOut: timeStr } : a))
    );
    showToast(`Chequeo de salida registrado`);
  };

  const justifyAbsence = (employeeId: string, notes: string) => {
    if (!hasPermission('attendance.review')) {
      showToast('Permiso denegado: Se requiere autorización para justificar faltas');
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    setAttendance((prev) => {
      const existing = prev.find((a) => a.employeeId === employeeId && a.date === todayStr);
      if (existing) {
        return prev.map((a) => (a.employeeId === employeeId && a.date === todayStr ? { ...a, status: 'justificado', notes } : a));
      } else {
        return [
          ...prev,
          {
            id: `att-${Date.now()}`,
            employeeId,
            date: todayStr,
            status: 'justificado',
            notes,
            deviceSimulated: 'Hikvision DS-K1T804AM'
          }
        ];
      }
    });
    showToast(`Falta justificada para empleado`);
  };

  // Pre-Payroll Calculation
  const getPrePayroll = (): PrePayrollRecord[] => {
    return employees.map((emp) => {
      const empAttendance = attendance.filter((a) => a.employeeId === emp.id);
      const daysWorked = empAttendance.filter((a) => a.status === 'puntual' || a.status === 'retardo').length;
      const unjustified = empAttendance.filter((a) => a.status === 'ausente').length;
      const justified = empAttendance.filter((a) => a.status === 'justificado').length;

      // Base pay for worked + justified days
      const effectiveDays = daysWorked + justified;
      const grossTotal = effectiveDays * emp.dailyRate;
      
      // Deductions for unjustified absences
      const deductions = unjustified * emp.dailyRate;
      const netTotal = Math.max(0, grossTotal - deductions);

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        dailyRate: emp.dailyRate,
        daysWorked,
        overtimeHours: 0,
        overtimePay: 0,
        bonuses: 0,
        deductions,
        unjustifiedAbsences: unjustified,
        justifiedAbsences: justified,
        grossTotal,
        netTotal,
        period: 'Periodo Actual Demo'
      };
    });
  };

  // Inventory & Recipes
  const addIngredient = (ingData: Omit<Ingredient, 'id'>) => {
    if (!hasPermission('inventory.receive') && !hasPermission('inventory.adjust')) {
      showToast('Permiso denegado: Se requiere permiso de inventario');
      return;
    }
    const newIng: Ingredient = { id: `ing-${Date.now()}`, ...ingData };
    setIngredients((prev) => [...prev, newIng]);
    logAuditEvent('ajuste_inventario', `Alta de nuevo insumo en catálogo: ${newIng.name}`, 'insumo', newIng.id, { ...ingData });
    showToast(`Insumo ${newIng.name} añadido`);
  };

  const recordInventoryMovement = (data: {
    ingredientId: string;
    type: InventoryMovementType;
    quantity: number;
    reason: string;
    saleFolio?: string;
    costImpact?: number;
  }): boolean => {
    if (data.type === 'merma' && !hasPermission('inventory.waste')) {
      showToast('Permiso denegado: Se requiere permiso para registrar mermas');
      return false;
    }
    if ((data.type === 'entrada' || data.type === 'compra') && !hasPermission('inventory.receive') && !hasPermission('inventory.adjust')) {
      showToast('Permiso denegado: Se requiere permiso de recepción de inventario');
      return false;
    }
    if ((data.type === 'ajuste_positivo' || data.type === 'ajuste_negativo') && !hasPermission('inventory.adjust')) {
      showToast('Permiso denegado: Se requiere permiso para ajustar existencias');
      return false;
    }

    const ing = ingredients.find((i) => i.id === data.ingredientId);
    if (!ing) {
      showToast('Insumo no encontrado');
      return false;
    }

    if (data.quantity <= 0) {
      showToast('La cantidad debe ser mayor a 0');
      return false;
    }

    const isAddition = data.type === 'entrada' || data.type === 'compra' || data.type === 'ajuste_positivo' || data.type === 'devolucion' || data.type === 'cancelacion';
    const newStock = isAddition ? ing.currentStock + data.quantity : Math.max(0, ing.currentStock - data.quantity);

    const now = new Date();
    const timestamp = now.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mov: InventoryMovement = {
      id: `mov-${now.getTime()}-${data.ingredientId}`,
      timestamp,
      ingredientId: data.ingredientId,
      ingredientName: ing.name,
      type: data.type,
      quantity: data.quantity,
      unit: ing.unit,
      reason: data.reason,
      responsibleUserId: currentUser.id,
      responsibleUserName: currentUser.name,
      saleFolio: data.saleFolio,
      costImpact: data.costImpact ?? Number((data.quantity * ing.costPerUnit).toFixed(2))
    };

    setIngredients((prev) => prev.map((i) => (i.id === data.ingredientId ? { ...i, currentStock: newStock } : i)));
    setMovements((prev) => [mov, ...prev]);

    if (data.type === 'merma') {
      logAuditEvent('merma', `Merma de ${data.quantity} ${ing.unit} en "${ing.name}": ${data.reason}`, 'insumo', ing.id, {
        quantity: data.quantity,
        unit: ing.unit,
        reason: data.reason,
        costImpact: mov.costImpact
      });
    } else {
      logAuditEvent('ajuste_inventario', `Movimiento "${data.type}" de ${data.quantity} ${ing.unit} en "${ing.name}"`, 'insumo', ing.id, {
        type: data.type,
        delta: isAddition ? data.quantity : -data.quantity,
        previousStock: ing.currentStock,
        newStock
      });
    }

    showToast(`Movimiento (${data.type}) registrado en ${ing.name}`);
    return true;
  };

  const updateIngredientStock = (id: string, newStock: number, reason: string) => {
    if (!hasPermission('inventory.adjust')) {
      showToast('Permiso denegado: No tienes permiso para ajustar existencias');
      return;
    }
    const ing = ingredients.find((i) => i.id === id);
    if (!ing) return;
    const diff = newStock - ing.currentStock;
    if (diff === 0) {
      showToast('El stock no presenta diferencias');
      return;
    }

    const isWaste = reason.toLowerCase().includes('merma') || reason.toLowerCase().includes('desperdicio') || reason.toLowerCase().includes('caduc');
    const movType: InventoryMovementType = isWaste ? 'merma' : diff > 0 ? 'ajuste_positivo' : 'ajuste_negativo';

    const now = new Date();
    const timestamp = now.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mov: InventoryMovement = {
      id: `mov-${now.getTime()}`,
      timestamp,
      ingredientId: id,
      ingredientName: ing.name,
      type: movType,
      quantity: Math.abs(diff),
      unit: ing.unit,
      reason,
      responsibleUserId: currentUser.id,
      responsibleUserName: currentUser.name,
      costImpact: Number((Math.abs(diff) * ing.costPerUnit).toFixed(2))
    };

    setIngredients((prev) => prev.map((item) => (item.id === id ? { ...item, currentStock: newStock } : item)));
    setMovements((prev) => [mov, ...prev]);

    if (isWaste) {
      logAuditEvent('merma', `Merma de ${Math.abs(diff)} ${ing.unit} en "${ing.name}": ${reason}`, 'insumo', ing.id, {
        previousStock: ing.currentStock,
        newStock,
        difference: diff
      });
    } else {
      logAuditEvent('ajuste_inventario', `Ajuste manual de stock en "${ing.name}" de ${ing.currentStock} a ${newStock} ${ing.unit} (${reason})`, 'insumo', ing.id, {
        previousStock: ing.currentStock,
        newStock,
        difference: diff
      });
    }

    showToast(`Stock de "${ing.name}" actualizado (${movType})`);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'code'>) => {
    if (!hasPermission('settings.manage') && !hasPermission('inventory.adjust')) {
      showToast('Permiso denegado: Se requiere permiso para modificar catálogo');
      return;
    }
    const code = `PROD-00${products.length + 1}`;
    const newProd: Product = { id: `prod-${Date.now()}`, code, ...prodData };
    setProducts((prev) => [...prev, newProd]);
    showToast(`Producto ${newProd.name} creado`);
  };

  const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    if (!hasPermission('settings.manage') && !hasPermission('inventory.adjust')) {
      showToast('Permiso denegado: Se requiere permiso para crear recetas');
      return;
    }
    const newRecipe: Recipe = { id: `rec-${Date.now()}`, ...recipeData };
    setRecipes((prev) => [...prev, newRecipe]);
    setProducts((prev) =>
      prev.map((p) => (p.id === recipeData.productId ? { ...p, recipeId: newRecipe.id } : p))
    );
    showToast(`Receta para ${recipeData.productName} guardada`);
  };

  // POS & Sales
  const registerSale = (
    items: { product: Product; quantity: number }[],
    paymentMethod: 'efectivo' | 'tarjeta',
    clientId?: string,
    options: { forceFriday?: boolean } = {}
  ) => {
    if (!hasPermission('sales.create')) {
      showToast('Permiso denegado: El rol activo no tiene permiso para cobrar en POS');
      return { success: false, folio: '', message: 'Sin permisos para registrar ventas' };
    }

    if (!items || items.length === 0) {
      showToast('No se puede cobrar un ticket vacío');
      return { success: false, folio: '', message: 'El carrito está vacío' };
    }

    // 1) Validar que las cantidades sean enteras y positivas
    const invalidItem = items.find((i) => !Number.isInteger(i.quantity) || i.quantity <= 0);
    if (invalidItem) {
      const msg = `Cantidad inválida para ${invalidItem.product.name}`;
      showToast(msg);
      return { success: false, folio: '', message: msg };
    }

    // 2) Validar que los productos estén marcados como disponibles
    const unavailableItem = items.find((i) => i.product.available === false);
    if (unavailableItem) {
      const msg = `El producto "${unavailableItem.product.name}" está marcado como no disponible`;
      showToast(msg);
      return { success: false, folio: '', message: msg };
    }

    // 3) Validar que alcancen los insumos antes de vender
    const shortages = findShortages(items, recipes, ingredients);
    if (shortages.length > 0) {
      const detail = shortages.map((s) => `${s.ingredientName} (disponible: ${s.available} ${s.unit}, requerido: ${s.needed})`).join(', ');
      showToast(`Insumos insuficientes: ${detail}`);
      return { success: false, folio: '', message: `Insumos insuficientes: ${detail}` };
    }

    // 4) Calcular folio consecutivo verificable
    const now = new Date();
    const existingFolioNumbers = sales
      .map((s) => {
        const match = s.folio.match(/^VTA-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);
    const baseFolio = codiaBetaConfig.sales.initialFolioNumber - 1;
    const maxFolio = existingFolioNumbers.length > 0 ? Math.max(...existingFolioNumbers) : baseFolio;
    const folio = `VTA-${maxFolio + 1}`;

    const timestamp = now.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 5) Calcular total, descuentos y sellos con las promociones vigentes
    const clientObj = clientId ? clients.find((c) => c.id === clientId) : undefined;
    const quote = quoteSale(items, promotions, clientObj, { date: now, forceFriday: options.forceFriday });

    if (quote.total < 0) {
      const msg = 'El total de la venta no puede ser negativo';
      showToast(msg);
      return { success: false, folio: '', message: msg };
    }

    const saleItems = items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    }));

    if (clientObj) {
      addStampsToClient(clientObj.id, quote.stamps, quote.total, folio);
    }

    const newSale: Sale = {
      id: `sale-${now.getTime()}`,
      folio,
      timestamp,
      items: saleItems,
      subtotal: quote.subtotal,
      discount: quote.discount,
      total: quote.total,
      paymentMethod,
      clientId: clientObj?.id,
      clientName: clientObj?.name,
      stampsEarned: clientObj ? quote.stamps : 0,
      promotionsApplied: quote.applied.map((a) => `${a.code}: ${a.detail}`)
    };

    setSales((prev) => [newSale, ...prev]);

    // Registrar auditoría de descuento si hubo promoción o ajuste
    if (quote.discount > 0) {
      logAuditEvent(
        'descuento',
        `Descuento de $${quote.discount} MXN aplicado en venta ${folio} (${quote.applied.map((a) => a.code).join(', ')})`,
        'venta',
        folio,
        {
          discount: quote.discount,
          subtotal: quote.subtotal,
          total: quote.total,
          promotions: quote.applied
        }
      );
    }

    // 6) Descontar inventario según recetas con tipo formal 'consumo_venta'
    const required = requiredIngredients(items, recipes);
    const movementsToAdd: InventoryMovement[] = [];
    required.forEach((qty, ingredientId) => {
      const ing = ingredients.find((i) => i.id === ingredientId);
      if (!ing) return;
      movementsToAdd.push({
        id: `mov-${now.getTime()}-${ingredientId}`,
        timestamp,
        ingredientId,
        ingredientName: ing.name,
        type: 'consumo_venta',
        quantity: qty,
        unit: ing.unit,
        reason: `Venta POS ${folio}`,
        saleFolio: folio,
        responsibleUserId: currentUser.id,
        responsibleUserName: currentUser.name,
        costImpact: Number((qty * ing.costPerUnit).toFixed(2))
      });
    });
    setIngredients((prev) =>
      prev.map((ing) => (required.has(ing.id) ? { ...ing, currentStock: ing.currentStock - (required.get(ing.id) ?? 0) } : ing))
    );
    if (movementsToAdd.length > 0) {
      setMovements((prev) => [...movementsToAdd, ...prev]);
    }

    showToast(`Venta ${folio} por $${quote.total} MXN registrada y descontada de inventario`);
    return { success: true, folio, message: `Venta registrada con éxito. Ticket: ${folio}` };
  };

  // Expenses & OCR
  const addExpense = (expData: Omit<Expense, 'id' | 'folio'>) => {
    if (!hasPermission('reports.financial')) {
      showToast('Permiso denegado: Se requiere permiso financiero para registrar egresos');
      return;
    }
    const folio = `EGR-${804 + expenses.length}`;
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      folio,
      ...expData
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Egreso ${folio} guardado correctamente`);
  };

  const simulateOcrScan = async (mockName: string): Promise<Omit<Expense, 'id' | 'folio'>> => {
    await new Promise((res) => setTimeout(res, 1200));

    const todayStr = new Date().toISOString().split('T')[0];
    const sampleMockData: Record<string, Omit<Expense, 'id' | 'folio'>> = {
      ticket_cafe: {
        date: todayStr,
        supplier: 'Café Tostado del Sur S.A. de C.V.',
        category: 'insumos',
        description: 'Bolsa 5kg Grano Arábica de Coatepec',
        subtotal: 1400,
        tax: 224,
        total: 1624,
        ocrScanned: true
      },
      ticket_leche: {
        date: todayStr,
        supplier: 'Comercializadora Láctea Central',
        category: 'insumos',
        description: '40L Leche Entera + 20L Deslactosada',
        subtotal: 1250,
        tax: 0,
        total: 1250,
        ocrScanned: true
      },
      ticket_mantenimiento: {
        date: todayStr,
        supplier: 'Técnicos de Espresso & Molinos MX',
        category: 'mantenimiento',
        description: 'Mantenimiento preventivo molino y empacadora',
        subtotal: 2100,
        tax: 336,
        total: 2436,
        ocrScanned: true
      }
    };

    return sampleMockData[mockName] || sampleMockData['ticket_cafe'];
  };

  // Invoicing
  const requestInvoice = (saleFolio: string, rfc: string, businessName: string, taxEmail: string): InvoiceSimulated => {
    const sale = sales.find((s) => s.folio === saleFolio);
    const total = sale ? sale.total : 150;
    const inv: InvoiceSimulated = {
      id: `inv-${Date.now()}`,
      saleFolio,
      rfc: rfc.toUpperCase(),
      businessName,
      taxEmail,
      total,
      status: 'emitida',
      uuidSimulated: `4A8B9C1D-${Math.random().toString(36).substring(2, 8).toUpperCase()}-4021-9981-ABCDEF123456`,
      date: new Date().toLocaleDateString()
    };
    setInvoices((prev) => [inv, ...prev]);
    showToast(`CFDI Factura emitida con éxito (Simulación PAC)`);
    return inv;
  };

  // Clients & Wallet & Promotions
  const addClient = (clientData: { name: string; email: string; phone: string; avatar?: string }) => {
    const code = `CLI-${8820 + clients.length + 1}`;
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      code,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      avatar: clientData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      qrCode: `CODIA-${code}-QR`,
      stamps: 1,
      stampsGoal: config.stampsPerReward,
      rewardsAvailable: 0,
      totalVisits: 1,
      totalSpent: 0,
      tier: 'Nuevo',
      lastVisit: today
    };
    setClients((prev) => [...prev, newClient]);
    
    // Registrar sello de bienvenida en movimientos de lealtad
    addLoyaltyMovement({
      clientId: newClient.id,
      clientName: newClient.name,
      type: 'sello_ganado',
      stampsDelta: 1,
      rewardsDelta: 0,
      previousStamps: 0,
      newStamps: 1,
      previousRewards: 0,
      newRewards: 0,
      reason: 'Sello de bienvenida por registro en Cliente Consentido'
    });

    showToast(`Cliente ${newClient.name} agregado a Cliente Consentido`);
    return newClient;
  };

  const addStampsToClient = (clientId: string, count: number, amountSpent = 0, saleFolio?: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const prevStamps = c.stamps;
          const prevRewards = c.rewardsAvailable;
          let newStamps = c.stamps + count;
          let rewardsToAdd = 0;
          if (newStamps >= c.stampsGoal) {
            rewardsToAdd = Math.floor(newStamps / c.stampsGoal);
            newStamps = newStamps % c.stampsGoal;
          }
          const totalVisits = c.totalVisits + 1;
          const tier = totalVisits > 15 ? 'VIP Consentido' : totalVisits > 5 ? 'Frecuente' : 'Nuevo';
          const newRewards = prevRewards + rewardsToAdd;

          // Registrar movimiento en el libro mayor de lealtad
          const movType: LoyaltyMovementType = count > 1 ? 'bonificacion' : 'sello_ganado';
          const now = new Date();
          const timestamp = now.toLocaleString('es-MX', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });

          const reason = rewardsToAdd > 0
            ? `Acumulación (+${count} sello(s)) y meta de ${c.stampsGoal} sellos completada (+${rewardsToAdd} recompensa)`
            : `Acumulación por compra ticket ${saleFolio || 'POS'} (+${count} sello(s))`;

          const loyMov: LoyaltyMovement = {
            id: `loy-mov-${now.getTime()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp,
            clientId: c.id,
            clientName: c.name,
            type: movType,
            stampsDelta: count,
            rewardsDelta: rewardsToAdd,
            previousStamps: prevStamps,
            newStamps,
            previousRewards: prevRewards,
            newRewards,
            reason,
            saleFolio,
            responsibleUserId: currentUser.id,
            responsibleUserName: currentUser.name
          };

          setLoyaltyMovements((lPrev) => [loyMov, ...lPrev]);

          return {
            ...c,
            stamps: newStamps,
            rewardsAvailable: newRewards,
            totalVisits,
            totalSpent: c.totalSpent + amountSpent,
            tier,
            lastVisit: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' })
          };
        }
        return c;
      })
    );
  };

  const redeemReward = (clientId: string) => {
    if (!hasPermission('loyalty.redeem') && !hasPermission('loyalty.view_own')) {
      showToast('Permiso denegado: Sin autorización para canjear recompensas');
      return false;
    }
    const client = clients.find((c) => c.id === clientId);
    if (!client || client.rewardsAvailable <= 0) {
      showToast('El cliente no tiene recompensas disponibles');
      return false;
    }

    const prevRewards = client.rewardsAvailable;
    const newRewards = prevRewards - 1;

    const now = new Date();
    const timestamp = now.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const loyMov: LoyaltyMovement = {
      id: `loy-mov-${now.getTime()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      clientId: client.id,
      clientName: client.name,
      type: 'canje',
      stampsDelta: 0,
      rewardsDelta: -1,
      previousStamps: client.stamps,
      newStamps: client.stamps,
      previousRewards: prevRewards,
      newRewards,
      reason: 'Canje en barra de cortesía (1 bebida gratis)',
      responsibleUserId: currentUser.id,
      responsibleUserName: currentUser.name
    };

    setLoyaltyMovements((prev) => [loyMov, ...prev]);

    logAuditEvent('canje_recompensa', `Canje de recompensa de cortesía para ${client.name} (${client.code})`, 'cliente', client.id, {
      previousRewards: prevRewards,
      newRewards
    });

    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, rewardsAvailable: newRewards } : c))
    );
    showToast(`Recompensa canjeada para ${client.name}`);
    return true;
  };

  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    if (!hasPermission('settings.manage')) {
      showToast('Permiso denegado: Se requiere permiso para crear promociones');
      return;
    }
    const newPromo: Promotion = { id: `prom-${Date.now()}`, ...promoData };
    setPromotions((prev) => [...prev, newPromo]);
    showToast(`Promoción "${newPromo.title}" publicada`);
  };

  const togglePromotion = (id: string) => {
    if (!hasPermission('settings.manage')) {
      showToast('Permiso denegado: Se requiere permiso para modificar promociones');
      return;
    }
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    showToast('Estado de promoción actualizado');
  };

  // Intelligent Bot Assistant
  const sendBotMessage = (userText: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: BotMessage = {
      id: `bot-msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr
    };

    setBotMessages((prev) => [...prev, userMsg]);

    const lower = userText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const has = (...words: string[]) => words.some((w) => lower.includes(w));
    const answers: string[] = [];
    let link: { label: string; tab: string; subTab?: string } | undefined = undefined;
    const empName = (id: string) => employees.find((e) => e.id === id)?.name ?? 'Empleado';

    if (has('vend', 'venta', 'ingreso', 'cobr', 'factur')) {
      const tickets = sales.filter((s) => !s.isShiftSummary);
      const ticketTotal = tickets.reduce((acc, s) => acc + s.total, 0);
      answers.push(`Hoy llevamos $${ticketTotal.toLocaleString('es-MX')} MXN en ${tickets.length} ventas.`);
      link = { label: 'Ir al Punto de Venta (POS)', tab: 'ventas' };
    }
    if (has('tarde', 'retard', 'llego', 'llegaron', 'puntual')) {
      const late = attendance.filter((a) => a.status === 'retardo').map((a) => `${empName(a.employeeId)} (${a.checkIn})`);
      answers.push(late.length > 0 ? `Llegaron tarde: ${late.join(', ')}.` : 'Nadie llegó tarde hoy.');
      link = link ?? { label: 'Ver Asistencia y Checador', tab: 'empleados', subTab: 'asistencia' };
    }
    if (has('falt', 'ausen', 'vino', 'asistencia')) {
      const absents = attendance
        .filter((a) => a.status === 'ausente' || a.status === 'justificado')
        .map((a) => `${empName(a.employeeId)} (${a.status})`);
      answers.push(absents.length > 0 ? `Ausencias de hoy: ${absents.join(', ')}.` : 'No hay faltas reportadas hoy.');
      link = link ?? { label: 'Ver Asistencia y Checador', tab: 'empleados', subTab: 'asistencia' };
    }
    if (has('stock', 'bajo', 'insumo', 'inventario', 'agot', 'falta de')) {
      const lowStock = ingredients.filter((i) => i.currentStock <= i.minStock);
      answers.push(
        lowStock.length > 0
          ? `Insumos por debajo del mínimo: ${lowStock.map((l) => `${l.name} (${l.currentStock} ${l.unit})`).join(', ')}.`
          : 'Todos los insumos están en niveles óptimos.'
      );
      link = link ?? { label: 'Revisar Inventario', tab: 'inventario', subTab: 'insumos' };
    }
    if (has('gasto', 'egreso', 'comprobante', 'gastamos')) {
      const totalExp = expenses.reduce((acc, e) => acc + e.total, 0);
      answers.push(`Egresos registrados: $${totalExp.toLocaleString('es-MX')} MXN en ${expenses.length} comprobantes.`);
      link = link ?? { label: 'Ver Egresos', tab: 'finanzas', subTab: 'gastos' };
    }
    if (has('recompensa', 'cliente', 'sello', 'wallet', 'tarjeta', 'premio')) {
      const withRewards = clients.filter((c) => c.rewardsAvailable > 0).map((c) => c.name);
      answers.push(
        withRewards.length > 0
          ? `Hay ${clients.length} clientes registrados; con recompensa lista: ${withRewards.join(', ')}.`
          : `Hay ${clients.length} clientes registrados y ninguno tiene recompensa pendiente.`
      );
      link = link ?? { label: 'Ver Wallet y Tarjetas', tab: 'cliente_consentido', subTab: 'wallet' };
    }
    if (has('promo', 'descuento', '2x1', 'oferta')) {
      const active = promotions.filter((p) => p.active).map((p) => `${p.title} (${p.code})`);
      answers.push(active.length > 0 ? `Promociones activas: ${active.join('; ')}.` : 'No hay promociones activas.');
      link = link ?? { label: 'Ver Promociones', tab: 'cliente_consentido', subTab: 'promociones' };
    }

    const reply =
      answers.length > 0
        ? answers.join(' ')
        : 'Puedo ayudarte con ventas, retardos y faltas, inventario, gastos, clientes con recompensa y promociones. Prueba: "¿Cuánto vendimos hoy y quién llegó tarde?"';

    setTimeout(() => {
      setBotMessages((prev) => [
        ...prev,
        {
          id: `bot-reply-${Date.now()}`,
          sender: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionableLink: link
        }
      ]);
    }, 500);
  };

  const resetToSeedData = () => {
    setConfig(initialConfig);
    setEmployees(initialEmployees);
    setAttendance(initialAttendance);
    setIngredients(initialIngredients);
    setProducts(initialProducts);
    setRecipes(initialRecipes);
    setSales(initialSales);
    setExpenses(initialExpenses);
    setClients(initialClients);
    setPromotions(initialPromotions);
    setMovements(initialMovements);
    setLoyaltyMovements(initialLoyaltyMovements);
    setAuditLogs(initialAuditLogs);
    setInvoices([]);
    showToast('Datos reiniciados al estado semilla de la demo');
  };

  return (
    <CodiaContext.Provider
      value={{
        config,
        updateConfig,
        currentUser,
        setCurrentUser,
        switchRole,
        hasPermission,
        demoUsers,
        activeTab,
        setActiveTab,
        subTab,
        setSubTab,
        employees,
        addEmployee,
        updateEmployee,
        attendance,
        registerCheckIn,
        registerCheckOut,
        justifyAbsence,
        getPrePayroll,
        ingredients,
        addIngredient,
        updateIngredientStock,
        recordInventoryMovement,
        products,
        addProduct,
        recipes,
        addRecipe,
        movements,
        sales,
        registerSale,
        expenses,
        addExpense,
        simulateOcrScan,
        invoices,
        requestInvoice,
        clients,
        addClient,
        addStampsToClient,
        redeemReward,
        loyaltyMovements,
        addLoyaltyMovement,
        promotions,
        addPromotion,
        togglePromotion,
        auditLogs,
        logAuditEvent,
        botMessages,
        sendBotMessage,
        toastMessage,
        showToast,
        resetToSeedData
      }}
    >
      {children}
    </CodiaContext.Provider>
  );
};

export const useCodia = () => {
  const context = useContext(CodiaContext);
  if (!context) throw new Error('useCodia must be used within CodiaProvider');
  return context;
};


