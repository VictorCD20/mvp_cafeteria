'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AccessRole,
  Employee,
  Ingredient,
  ModuleId,
  Permission,
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
  InvoiceSimulated,
  BotMessage
} from '../types';

import {
  initialConfig,
  initialRoles,
  initialEmployees,
  initialIngredients,
  initialProducts,
  initialRecipes,
  initialClients,
  initialPromotions,
  initialAttendance,
  initialSales,
  initialExpenses,
  initialMovements
} from '../data/seedData';
import { promotionsForClient, quoteSale } from '../lib/promotions';
import { findShortages, requiredIngredients } from '../lib/inventory';
import { todayInMexico, timeInMexico } from '../lib/dates';
import { checkInStatus, latestAttendanceByEmployee } from '../lib/attendance';
import { homeTabFor, isModuleId, roleHasPermission } from '../lib/permissions';

type ActionResult = { success: boolean; message: string };

interface CodiaContextType {
  config: SystemConfig;
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  
  // Navigation State
  activeTab: string;
  setActiveTab: (tab: string, sub?: string) => void;
  subTab: string;
  setSubTab: (sub: string) => void;

  // Session & Roles
  currentUser: Employee | null;
  currentRole: AccessRole | undefined;
  can: (permission: Permission) => boolean;
  login: (employeeId: string, pin: string) => boolean;
  logout: () => void;
  roles: AccessRole[];
  addRole: (role: Omit<AccessRole, 'id' | 'isSystem'>) => ActionResult;
  updateRole: (id: string, role: Partial<Omit<AccessRole, 'id' | 'isSystem'>>) => ActionResult;
  deleteRole: (id: string) => ActionResult;
  
  // Employee & Attendance & Payroll
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id' | 'code'>) => ActionResult;
  updateEmployee: (id: string, emp: Partial<Employee>) => ActionResult;
  deleteEmployee: (id: string) => ActionResult;
  attendance: AttendanceRecord[];
  registerCheckIn: (employeeId: string, status?: 'puntual' | 'retardo') => void;
  registerCheckOut: (employeeId: string) => void;
  justifyAbsence: (employeeId: string, notes: string) => void;
  getPrePayroll: () => PrePayrollRecord[];
  
  // Inventory & Recipes
  ingredients: Ingredient[];
  addIngredient: (ing: Omit<Ingredient, 'id'>) => void;
  updateIngredientStock: (id: string, newStock: number, reason: string) => void;
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
  addStampsToClient: (clientId: string, count: number, amountSpent?: number) => void;
  redeemReward: (clientId: string) => boolean;
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  togglePromotion: (id: string) => void;

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
  const [activeTabState, setActiveTabState] = useState<string>('inicio');
  const [subTab, setSubTabState] = useState<string>('');
  const [roles, setRoles] = useState<AccessRole[]>(initialRoles);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Sesión: el rol del usuario decide qué módulos existen para él.
  const currentUser = employees.find((e) => e.id === currentUserId && e.status === 'activo') ?? null;
  const currentRole = currentUser ? roles.find((r) => r.id === currentUser.accessRoleId) : undefined;
  const can = (permission: Permission) => roleHasPermission(currentRole, permission);
  const canOpen = (tab: string) => isModuleId(tab) && can(tab);
  // Si la URL o un enlace apunta a un módulo sin permiso, se muestra la pantalla de inicio del rol.
  const activeTab: ModuleId = canOpen(activeTabState) ? (activeTabState as ModuleId) : homeTabFor(currentRole);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const rawTab = params.get('tab');
      const tabParam = rawTab === 'finances' ? 'finanzas' : rawTab;
      const subParam = params.get('subTab') || params.get('sub') || '';

      if (tabParam && isModuleId(tabParam)) {
        setActiveTabState(tabParam);
        setSubTabState(subParam);
      } else {
        setActiveTabState('inicio');
        setSubTabState('');
        // URL inválida -> destino seguro inicio
        if (tabParam) window.history.replaceState({}, '', window.location.pathname);
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

  // Cambia de módulo y (opcional) de subpestaña en un solo paso, para que la URL quede completa.
  const setActiveTab = (tab: string, sub = '') => {
    const targetTab = canOpen(tab) ? tab : homeTabFor(currentRole);
    const targetSub = targetTab === tab ? sub : '';
    setActiveTabState(targetTab);
    setSubTabState(targetSub);
    updateUrlNav(targetTab, targetSub);
  };

  const setSubTab = (sub: string) => {
    setSubTabState(sub);
    updateUrlNav(activeTab, sub);
  };

  const login = (employeeId: string, pin: string) => {
    const emp = employees.find((e) => e.id === employeeId && e.status === 'activo');
    if (!emp || emp.pin !== pin) return false;
    setCurrentUserId(emp.id);
    showToast(`Hola, ${emp.name.split(' ')[0]}. Sesión iniciada como ${roles.find((r) => r.id === emp.accessRoleId)?.name ?? 'usuario'}`);
    return true;
  };

  const logout = () => {
    setCurrentUserId(null);
    setActiveTabState('inicio');
    setSubTabState('');
    if (typeof window !== 'undefined') window.history.replaceState({}, '', window.location.pathname);
  };

  // Roles
  const rolesWithUserAdmin = (list: AccessRole[]) => list.filter((r) => r.permissions.includes('usuarios')).map((r) => r.id);

  const addRole = (roleData: Omit<AccessRole, 'id' | 'isSystem'>): ActionResult => {
    const name = roleData.name.trim();
    if (!name) return { success: false, message: 'El rol necesita un nombre.' };
    if (roles.some((r) => r.name.toLowerCase() === name.toLowerCase())) return { success: false, message: 'Ya existe un rol con ese nombre.' };
    if (roleData.permissions.length === 0) return { success: false, message: 'Elige al menos un permiso.' };
    setRoles((prev) => [...prev, { ...roleData, name, id: `role-${Date.now()}` }]);
    showToast(`Rol "${name}" creado`);
    return { success: true, message: 'Rol creado' };
  };

  const updateRole = (id: string, roleData: Partial<Omit<AccessRole, 'id' | 'isSystem'>>): ActionResult => {
    const role = roles.find((r) => r.id === id);
    if (!role) return { success: false, message: 'El rol no existe.' };
    if (role.isSystem) return { success: false, message: `El rol ${role.name} es del sistema y no se puede modificar.` };
    if (roleData.permissions && roleData.permissions.length === 0) return { success: false, message: 'Un rol debe tener al menos un permiso.' };
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...roleData } : r)));
    return { success: true, message: 'Rol actualizado' };
  };

  const deleteRole = (id: string): ActionResult => {
    const role = roles.find((r) => r.id === id);
    if (!role) return { success: false, message: 'El rol no existe.' };
    if (role.isSystem) return { success: false, message: `El rol ${role.name} es del sistema y no se puede eliminar.` };
    const members = employees.filter((e) => e.accessRoleId === id).length;
    if (members > 0) return { success: false, message: `Reasigna primero a las ${members} persona(s) con este rol.` };
    setRoles((prev) => prev.filter((r) => r.id !== id));
    showToast(`Rol "${role.name}" eliminado`);
    return { success: true, message: 'Rol eliminado' };
  };
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [movements, setMovements] = useState<InventoryMovement[]>(initialMovements);
  const [invoices, setInvoices] = useState<InvoiceSimulated[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    {
      id: 'bot-1',
      sender: 'bot',
      text: '¡Hola! Soy tu Asistente Virtual CODIA. Puedo responder preguntas sobre ventas del día, inventario bajo, retardos y faltas, gastos, clientes con recompensa y promociones.',
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
    setConfig((prev) => ({ ...prev, ...newCfg }));
    showToast('Configuración del sistema actualizada');
  };

  // Employees
  const validateEmployee = (data: Partial<Employee>, exceptId?: string): string | null => {
    if (data.name !== undefined && data.name.trim().length < 3) return 'Escribe el nombre completo.';
    if (data.pin !== undefined) {
      if (!/^\d{4}$/.test(data.pin)) return 'El PIN debe tener 4 dígitos.';
      if (employees.some((e) => e.id !== exceptId && e.pin === data.pin)) return 'Ese PIN ya lo usa otra persona.';
    }
    if (data.accessRoleId !== undefined && !roles.some((r) => r.id === data.accessRoleId)) return 'Elige un rol de acceso válido.';
    return null;
  };

  /** Siempre debe quedar al menos una persona activa que pueda administrar personal y roles. */
  const keepsAnAdmin = (next: Employee[]) => {
    const adminRoles = rolesWithUserAdmin(roles);
    return next.some((e) => e.status === 'activo' && adminRoles.includes(e.accessRoleId));
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'code'>): ActionResult => {
    const error = validateEmployee(empData);
    if (error) return { success: false, message: error };
    const lastNumber = Math.max(0, ...employees.map((e) => Number(e.code.replace('EMP-', '')) || 0));
    const code = `EMP-${String(lastNumber + 1).padStart(3, '0')}`;
    const newEmp: Employee = { ...empData, id: `emp-${Date.now()}`, code, name: empData.name.trim() };
    setEmployees((prev) => [...prev, newEmp]);
    showToast(`Empleado ${newEmp.name} registrado con éxito`);
    return { success: true, message: 'Empleado registrado' };
  };

  const updateEmployee = (id: string, empData: Partial<Employee>): ActionResult => {
    const error = validateEmployee(empData, id);
    if (error) return { success: false, message: error };
    const next = employees.map((e) => (e.id === id ? { ...e, ...empData } : e));
    if (!keepsAnAdmin(next)) return { success: false, message: 'Debe quedar al menos una persona activa que administre el personal.' };
    setEmployees(next);
    showToast('Datos de empleado actualizados');
    return { success: true, message: 'Empleado actualizado' };
  };

  const deleteEmployee = (id: string): ActionResult => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return { success: false, message: 'El empleado no existe.' };
    if (id === currentUserId) return { success: false, message: 'No puedes eliminar tu propio usuario.' };
    const next = employees.filter((e) => e.id !== id);
    if (!keepsAnAdmin(next)) return { success: false, message: 'Debe quedar al menos una persona activa que administre el personal.' };
    setEmployees(next);
    showToast(`Empleado ${emp.name} eliminado`);
    return { success: true, message: 'Empleado eliminado' };
  };

  // Attendance (fecha y hora siempre en hora de México)
  const registerCheckIn = (employeeId: string, statusOverride?: 'puntual' | 'retardo') => {
    const todayStr = todayInMexico();
    const timeStr = timeInMexico();
    const emp = employees.find((e) => e.id === employeeId);
    const status = statusOverride || checkInStatus(timeStr, emp?.schedule ?? '', config.lateToleranceMinutes);

    setAttendance((prev) => {
      const existingIndex = prev.findIndex((a) => a.employeeId === employeeId && a.date === todayStr);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], checkIn: timeStr, status, notes: undefined };
        return copy;
      }
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
    });
    showToast(`Entrada registrada para ${emp?.name || 'Empleado'} a las ${timeStr} (${status})`);
  };

  const registerCheckOut = (employeeId: string) => {
    const todayStr = todayInMexico();
    const timeStr = timeInMexico();
    const hasEntry = attendance.some((a) => a.employeeId === employeeId && a.date === todayStr && a.checkIn);
    if (!hasEntry) {
      showToast('Primero registra la entrada de hoy');
      return;
    }
    setAttendance((prev) =>
      prev.map((a) => (a.employeeId === employeeId && a.date === todayStr ? { ...a, checkOut: timeStr } : a))
    );
    showToast(`Salida registrada a las ${timeStr}`);
  };

  const justifyAbsence = (employeeId: string, notes: string) => {
    const todayStr = todayInMexico();
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
    const newIng: Ingredient = { id: `ing-${Date.now()}`, ...ingData };
    setIngredients((prev) => [...prev, newIng]);
    showToast(`Insumo ${newIng.name} añadido`);
  };

  const updateIngredientStock = (id: string, newStock: number, reason: string) => {
    let ingName = '';
    let diff = 0;

    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id === id) {
          ingName = ing.name;
          diff = newStock - ing.currentStock;
          return { ...ing, currentStock: newStock };
        }
        return ing;
      })
    );

    if (diff !== 0) {
      setMovements((prev) => [
        {
          id: `mov-${Date.now()}`,
          timestamp: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
          ingredientId: id,
          ingredientName: ingName,
          type: diff > 0 ? 'entrada' : 'salida',
          quantity: Math.abs(diff),
          unit: ingredients.find((i) => i.id === id)?.unit || 'pza',
          reason
        },
        ...prev
      ]);
    }
    showToast(`Stock de insumo actualizado`);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'code'>) => {
    const code = `PROD-00${products.length + 1}`;
    const newProd: Product = { id: `prod-${Date.now()}`, code, ...prodData };
    setProducts((prev) => [...prev, newProd]);
    showToast(`Producto ${newProd.name} creado`);
  };

  const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = { id: `rec-${Date.now()}`, ...recipeData };
    setRecipes((prev) => [...prev, newRecipe]);
    // Associate recipe to product
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
    if (items.length === 0) {
      return { success: false, folio: '', message: 'El carrito está vacío' };
    }

    // 1) Validar que alcancen los insumos antes de vender
    const shortages = findShortages(items, recipes, ingredients);
    if (shortages.length > 0) {
      const detail = shortages.map((s) => `${s.ingredientName} (hay ${s.available} ${s.unit}, se necesitan ${s.needed})`).join(', ');
      showToast(`No hay insumos suficientes: ${detail}`);
      return { success: false, folio: '', message: `Insumos insuficientes: ${detail}` };
    }

    const now = new Date();
    const lastNumber = Math.max(1048, ...sales.map((s) => Number(s.folio.replace('VTA-', '')) || 0));
    const folio = `VTA-${lastNumber + 1}`;
    const timestamp = now.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 2) Calcular total, descuentos y sellos con las promociones vigentes
    const clientObj = clientId ? clients.find((c) => c.id === clientId) : undefined;
    const quote = quoteSale(items, promotions, clientObj, { date: now, forceFriday: options.forceFriday });

    const saleItems = items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    }));

    if (clientObj) {
      addStampsToClient(clientObj.id, quote.stamps, quote.total);
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

    // 3) Descontar inventario según recetas (sin mutar el estado anterior)
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
        type: 'salida',
        quantity: qty,
        unit: ing.unit,
        reason: `Venta POS ${folio}`
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
    // Simulate realistic OCR extraction delay
    await new Promise((res) => setTimeout(res, 1200));

    const todayStr = todayInMexico();
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
    showToast(`Cliente ${newClient.name} agregado a Cliente Consentido`);
    return newClient;
  };

  const addStampsToClient = (clientId: string, count: number, amountSpent = 0) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          let newStamps = c.stamps + count;
          let rewardsToAdd = 0;
          if (newStamps >= c.stampsGoal) {
            rewardsToAdd = Math.floor(newStamps / c.stampsGoal);
            newStamps = newStamps % c.stampsGoal;
          }
          const totalVisits = c.totalVisits + 1;
          const tier = totalVisits > 15 ? 'VIP Consentido' : totalVisits > 5 ? 'Frecuente' : 'Nuevo';

          return {
            ...c,
            stamps: newStamps,
            rewardsAvailable: c.rewardsAvailable + rewardsToAdd,
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
    const client = clients.find((c) => c.id === clientId);
    if (!client || client.rewardsAvailable <= 0) {
      showToast('El cliente no tiene recompensas disponibles');
      return false;
    }
    // Promociones con producto de regalo se entregan junto con la recompensa (se evalúan antes de descontarla).
    const gifts = promotionsForClient(promotions, client).filter((p) => p.freeItem);
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, rewardsAvailable: c.rewardsAvailable - 1 } : c))
    );
    const giftText = gifts.length > 0 ? ` + regalo: ${gifts.map((g) => `${g.freeItem} (${g.code})`).join(', ')}` : '';
    showToast(`Recompensa canjeada para ${client.name}${giftText}`);
    return true;
  };

  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = { id: `prom-${Date.now()}`, ...promoData };
    setPromotions((prev) => [...prev, newPromo]);
    showToast(`Promoción "${newPromo.title}" publicada`);
  };

  const togglePromotion = (id: string) => {
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
    const todayAttendance = Array.from(latestAttendanceByEmployee(attendance).values()).filter((a) =>
      employees.some((e) => e.id === a.employeeId)
    );

    if (has('vend', 'venta', 'ingreso', 'cobr', 'factur')) {
      const tickets = sales.filter((s) => !s.isShiftSummary);
      const ticketTotal = tickets.reduce((acc, s) => acc + s.total, 0);
      answers.push(`Hoy llevamos $${ticketTotal.toLocaleString('es-MX')} MXN en ${tickets.length} ventas.`);
      link = { label: 'Ir al Punto de Venta (POS)', tab: 'ventas' };
    }
    if (has('tarde', 'retard', 'llego', 'llegaron', 'puntual')) {
      const late = todayAttendance.filter((a) => a.status === 'retardo').map((a) => `${empName(a.employeeId)} (${a.checkIn})`);
      answers.push(late.length > 0 ? `Llegaron tarde: ${late.join(', ')}.` : 'Nadie llegó tarde hoy.');
      link = link ?? { label: 'Ver Asistencia y Checador', tab: 'empleados', subTab: 'asistencia' };
    }
    if (has('falt', 'ausen', 'vino', 'asistencia')) {
      const absents = todayAttendance
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
      link = link ?? { label: 'Ver recompensas por canjear', tab: 'cliente_consentido', subTab: 'recompensas' };
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
    setRoles(initialRoles);
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
    setInvoices([]);
    showToast('Datos reiniciados al estado semilla de la demo');
  };

  return (
    <CodiaContext.Provider
      value={{
        config,
        updateConfig,
        activeTab,
        setActiveTab,
        subTab,
        setSubTab,
        currentUser,
        currentRole,
        can,
        login,
        logout,
        roles,
        addRole,
        updateRole,
        deleteRole,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        attendance,
        registerCheckIn,
        registerCheckOut,
        justifyAbsence,
        getPrePayroll,
        ingredients,
        addIngredient,
        updateIngredientStock,
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
        promotions,
        addPromotion,
        togglePromotion,
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
