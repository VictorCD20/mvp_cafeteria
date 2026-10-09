export type Role = 'administrador' | 'barista' | 'cajero' | 'cocina' | 'encargado';

export type UserRole = 'superadmin' | 'administrador' | 'encargado' | 'empleado' | 'cliente';

export type OperativeRole = 'administrador' | 'encargado' | 'empleado' | 'cliente';
export const OPERATIVE_ROLES: OperativeRole[] = ['administrador', 'encargado', 'empleado', 'cliente'];

export type ModuleStatus = 'activo' | 'inactivo' | 'simulado' | 'planeado';

export interface ModuleTechnicalInfo {
  key: string;
  name: string;
  version: string;
  status: ModuleStatus;
  dependencies: string[];
  description: string;
  category: 'core' | 'operativo' | 'administrativo' | 'simulado' | 'planeado';
}

export type Permission =
  | 'sales.create'
  | 'sales.view_own'
  | 'sales.view_branch'
  | 'sales.cancel'
  | 'sales.discount'
  | 'cash.open'
  | 'cash.close'
  | 'cash.adjust'
  | 'inventory.view'
  | 'inventory.receive'
  | 'inventory.count'
  | 'inventory.adjust'
  | 'inventory.waste'
  | 'customers.create'
  | 'customers.view'
  | 'customers.view_own'
  | 'loyalty.adjust'
  | 'loyalty.redeem'
  | 'loyalty.view_own'
  | 'employees.view'
  | 'employees.manage'
  | 'attendance.review'
  | 'reports.operational'
  | 'reports.financial'
  | 'settings.manage'
  | 'users.manage'
  | 'roles.manage'
  | 'audit.view'
  | '*';

export interface ActiveUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  clientId?: string;
  avatar?: string;
  branchId: string;
}

export interface Employee {
  id: string;
  code: string; // e.g. EMP-001
  name: string;
  role: Role;
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
  freeItem?: string;
  bonusStamps?: number;
}

export type ThemePresetKey = 'cafe' | 'neutro' | 'oscuro' | 'alto_contraste' | 'personalizado';
export type ThemeMode = 'light' | 'dark' | 'system';
export type VisualDensity = 'comfortable' | 'compact';
export type BrandLogoType = 'coffee' | 'cup' | 'flame' | 'sparkles' | 'store';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  foreground: string;
  button: string;
}

export interface ThemePreset extends ThemeColors {
  id: string;
  name: string;
  description: string;
}

export interface AppearanceConfig {
  activeTheme: ThemePresetKey;
  allowCustomTheme: boolean;
  mode: ThemeMode;
  density: VisualDensity;
  brandName: string;
  brandLogo: BrandLogoType;
  customColors: ThemeColors;
  presets: Record<string, ThemePreset>;
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
  appearance?: AppearanceConfig;
}

export type InventoryMovementType =
  | 'entrada'
  | 'compra'
  | 'consumo_venta'
  | 'merma'
  | 'ajuste_positivo'
  | 'ajuste_negativo'
  | 'devolucion'
  | 'cancelacion'
  | 'salida'
  | 'ajuste'
  | 'venta';

export interface InventoryMovement {
  id: string;
  timestamp: string;
  ingredientId: string;
  ingredientName: string;
  type: InventoryMovementType;
  quantity: number;
  unit: string;
  reason: string;
  responsibleUserId?: string;
  responsibleUserName?: string;
  saleFolio?: string;
  costImpact?: number;
}

export type LoyaltyMovementType =
  | 'sello_ganado'
  | 'bonificacion'
  | 'ajuste'
  | 'canje'
  | 'vencimiento'
  | 'reversion';

export interface LoyaltyMovement {
  id: string;
  timestamp: string;
  clientId: string;
  clientName: string;
  type: LoyaltyMovementType;
  stampsDelta: number;
  rewardsDelta: number;
  previousStamps: number;
  newStamps: number;
  previousRewards: number;
  newRewards: number;
  reason: string;
  saleFolio?: string;
  responsibleUserId: string;
  responsibleUserName: string;
}

export type AuditActionType =
  | 'descuento'
  | 'merma'
  | 'ajuste_inventario'
  | 'cambio_rol'
  | 'cancelacion'
  | 'canje_recompensa'
  | 'configuracion'
  | 'modificacion_empleado';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditActionType;
  description: string;
  responsibleUserId: string;
  responsibleUserName: string;
  responsibleRole: UserRole;
  targetEntity?: string;
  targetId?: string;
  details?: Record<string, any>;
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

