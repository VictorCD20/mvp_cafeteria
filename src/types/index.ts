export type Role = 'administrador' | 'barista' | 'cajero' | 'cocina' | 'encargado';

/** Módulos del panel (coinciden con `activeTab`). */
export type ModuleId =
  | 'inicio'
  | 'ventas'
  | 'inventario'
  | 'empleados'
  | 'finanzas'
  | 'cliente_consentido'
  | 'vista_cliente'
  | 'asistente'
  | 'reportes'
  | 'configuracion';

/** Permiso = acceso a un módulo o a una acción sensible. */
export type Permission = ModuleId | 'promociones' | 'usuarios';

/** Rol de acceso al sistema (distinto del puesto del empleado). */
export interface AccessRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean; // no se puede editar ni eliminar
}

export interface Employee {
  id: string;
  code: string; // e.g. EMP-001
  name: string;
  role: Role; // puesto
  accessRoleId: string;
  pin: string; // 4 dígitos, demo (en producción iría cifrado en el servidor)
  dailyRate: number; // e.g. $450 MXN
  schedule: string; // e.g. "07:00 - 15:00"
  workDays: string; // e.g. "L-V"
  status: 'activo' | 'inactivo';
  email: string;
  phone: string;
  avatar: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:MM
  checkOut?: string; // HH:MM
  status: 'puntual' | 'retardo' | 'ausente' | 'justificado';
  notes?: string;
  deviceSimulated: string; // "Hikvision DS-K1T804AM"
}

export interface PrePayrollRecord {
  employeeId: string;
  employeeName: string;
  role: string;
  dailyRate: number;
  daysWorked: number;
  overtimeHours: number;
  overtimePay: number;
  bonuses: number;
  deductions: number;
  unjustifiedAbsences: number;
  justifiedAbsences: number;
  grossTotal: number;
  netTotal: number;
  period: string; // e.g. "2026-W39"
}

export interface Ingredient {
  id: string;
  name: string;
  unit: 'g' | 'ml' | 'pza' | 'kg' | 'lt';
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  category: 'granos' | 'lacteos' | 'desechables' | 'jarabes' | 'panaderia' | 'perecederos';
}

export interface RecipeItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  productId: string;
  productName: string;
  items: RecipeItem[];
  estimatedCost: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: 'cafe_caliente' | 'cafe_frio' | 'te_infusiones' | 'reposteria' | 'alimentos';
  price: number;
  image: string;
  available: boolean;
  recipeId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  folio: string; // e.g. VTA-1049
  timestamp: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'efectivo' | 'tarjeta';
  clientId?: string;
  clientName?: string;
  stampsEarned?: number;
  promotionsApplied?: string[];
  isShiftSummary?: boolean; // corte de caja de días anteriores (solo datos demo)
}

export interface Expense {
  id: string;
  folio: string;
  date: string;
  supplier: string;
  category: 'insumos' | 'mantenimiento' | 'servicios' | 'nomina' | 'otros';
  description: string;
  subtotal: number;
  tax: number; // IVA
  total: number;
  receiptUrl?: string;
  ocrScanned: boolean;
}

export interface Client {
  id: string;
  code: string; // e.g. CLI-8821
  name: string;
  email: string;
  phone: string;
  qrCode: string;
  stamps: number; // 0 to 8
  stampsGoal: number; // default 8
  rewardsAvailable: number;
  totalVisits: number;
  totalSpent: number;
  tier: 'Nuevo' | 'Frecuente' | 'VIP Consentido';
  lastVisit: string;
  avatar: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  audience: 'todos' | 'frecuentes' | 'nuevos' | 'proximos_recompensa' | 'inactivos';
  validUntil: string;
  active: boolean;
  code: string;
  discountPercentage?: number;
  appliesTo?: Product['category'][]; // categorías con descuento; vacío = todo el ticket
  freeItem?: string;
  bonusStamps?: number;
  fridayOnly?: boolean;
  minPurchase?: number;
}

export interface SystemConfig {
  cafeteriaName: string;
  branchName: string;
  lateToleranceMinutes: number;
  stampsPerReward: number;
  currency: string;
  taxRate: number; // e.g. 0.16
  address: string;
  phone: string;
  logoText: string;
}

export interface InventoryMovement {
  id: string;
  timestamp: string;
  ingredientId: string;
  ingredientName: string;
  type: 'entrada' | 'salida' | 'ajuste' | 'venta';
  quantity: number;
  unit: string;
  reason: string;
}

export interface InvoiceSimulated {
  id: string;
  saleFolio: string;
  rfc: string;
  businessName: string;
  taxEmail: string;
  total: number;
  status: 'pendiente' | 'emitida' | 'cancelada';
  uuidSimulated: string;
  date: string;
}

export interface BotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionableLink?: { label: string; tab: string; subTab?: string };
}
