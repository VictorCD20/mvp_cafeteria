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
  InvoiceSimulated,
  BotMessage
} from '../types';

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
  initialMovements
} from '../data/seedData';
import { quoteSale } from '../lib/promotions';
import { findShortages, requiredIngredients } from '../lib/inventory';

interface CodiaContextType {
  config: SystemConfig;
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  
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
  const [invoices, setInvoices] = useState<InvoiceSimulated[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    setConfig((prev) => ({ ...prev, ...newCfg }));
    showToast('Configuración del sistema actualizada');
  };

  // Employees
  const addEmployee = (empData: Omit<Employee, 'id' | 'code'>) => {
    const id = `emp-${Date.now()}`;
    const code = `EMP-00${employees.length + 1}`;
    const newEmp: Employee = { id, code, ...empData };
    setEmployees((prev) => [...prev, newEmp]);
    showToast(`Empleado ${newEmp.name} registrado con éxito`);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...empData } : e)));
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
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, rewardsAvailable: c.rewardsAvailable - 1 } : c))
    );
    showToast(`Recompensa canjeada para ${client.name}`);
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
