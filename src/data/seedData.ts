import { Employee, Ingredient, Product, Recipe, Client, Promotion, Sale, Expense, AttendanceRecord, SystemConfig, InventoryMovement, LoyaltyMovement, AuditLogEntry } from '../types';
import codiaBetaConfig from '../config/codia-beta.json';
import employeesData from './employees.json';
import ingredientsData from './ingredients.json';
import productsData from './products.json';
import recipesData from './recipes.json';
import customersData from './customers.json';
import promotionsData from './promotions.json';
import attendanceData from './attendance.json';
import salesData from './sales.json';
import expensesData from './expenses.json';
import movementsData from './movements.json';
import loyaltyMovementsData from './loyaltyMovements.json';
import auditLogsData from './auditLogs.json';

const mainBranch = codiaBetaConfig.cafeteria.branches[0];

export const initialConfig: SystemConfig = {
  cafeteriaName: codiaBetaConfig.cafeteria.name,
  branchName: mainBranch ? mainBranch.name : 'Sucursal Principal - Centro',
  lateToleranceMinutes: codiaBetaConfig.attendance.defaultToleranceMinutes,
  stampsPerReward: codiaBetaConfig.loyalty.stampsPerReward,
  currency: codiaBetaConfig.application.currency,
  taxRate: codiaBetaConfig.sales.defaultTaxRate,
  address: mainBranch ? mainBranch.address : 'Av. Reforma 402, Col. Juárez, CDMX',
  phone: mainBranch ? mainBranch.phone : '55 1234 5678',
  logoText: 'CODIA',
  appearance: codiaBetaConfig.appearance as unknown as SystemConfig['appearance']
};

export const initialEmployees: Employee[] = employeesData as Employee[];
export const initialIngredients: Ingredient[] = ingredientsData as Ingredient[];
export const initialProducts: Product[] = productsData as Product[];
export const initialRecipes: Recipe[] = recipesData as Recipe[];
export const initialClients: Client[] = customersData as Client[];
export const initialPromotions: Promotion[] = promotionsData as Promotion[];
export const initialAttendance: AttendanceRecord[] = attendanceData as AttendanceRecord[];
export const initialSales: Sale[] = salesData as Sale[];
export const initialExpenses: Expense[] = expensesData as Expense[];
export const initialMovements: InventoryMovement[] = movementsData as InventoryMovement[];
export const initialLoyaltyMovements: LoyaltyMovement[] = loyaltyMovementsData as LoyaltyMovement[];
export const initialAuditLogs: AuditLogEntry[] = auditLogsData as AuditLogEntry[];

