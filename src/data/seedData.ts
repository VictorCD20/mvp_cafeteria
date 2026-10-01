import { Employee, Ingredient, Product, Recipe, Client, Promotion, Sale, Expense, AttendanceRecord, SystemConfig, InventoryMovement } from '../types';

export const initialConfig: SystemConfig = {
  cafeteriaName: 'CODIA Cafetería Gourmet',
  branchName: 'Sucursal Principal - Centro',
  lateToleranceMinutes: 15,
  stampsPerReward: 8,
  currency: 'MXN',
  taxRate: 0.16,
  address: 'Av. Reforma 402, Col. Juárez, CDMX',
  phone: '55 1234 5678',
  logoText: 'CODIA'
};

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    code: 'EMP-001',
    name: 'Laura Méndez',
    role: 'administrador',
    dailyRate: 650,
    schedule: '07:00 - 16:00',
    workDays: 'Lunes a Viernes',
    status: 'activo',
    email: 'laura.mendez@codia.com',
    phone: '55 9876 5432',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-2',
    code: 'EMP-002',
    name: 'Ana Torres',
    role: 'barista',
    dailyRate: 430,
    schedule: '07:00 - 15:00',
    workDays: 'Lunes a Sábado',
    status: 'activo',
    email: 'ana.torres@codia.com',
    phone: '55 8765 4321',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-3',
    code: 'EMP-003',
    name: 'Luis García',
    role: 'cajero',
    dailyRate: 400,
    schedule: '08:00 - 16:00',
    workDays: 'Lunes a Domingo',
    status: 'activo',
    email: 'luis.garcia@codia.com',
    phone: '55 7654 3210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-4',
    code: 'EMP-004',
    name: 'Sofía Martínez',
    role: 'barista',
    dailyRate: 430,
    schedule: '14:00 - 22:00',
    workDays: 'Martes a Domingo',
    status: 'activo',
    email: 'sofia.martinez@codia.com',
    phone: '55 6543 2109',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-5',
    code: 'EMP-005',
    name: 'Carlos Ramírez',
    role: 'encargado',
    dailyRate: 580,
    schedule: '08:00 - 17:00',
    workDays: 'Lunes a Sábado',
    status: 'activo',
    email: 'carlos.ramirez@codia.com',
    phone: '55 5432 1098',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'emp-6',
    code: 'EMP-006',
    name: 'María López',
    role: 'cocina',
    dailyRate: 440,
    schedule: '07:00 - 15:00',
    workDays: 'Lunes a Sábado',
    status: 'activo',
    email: 'maria.lopez@codia.com',
    phone: '55 4321 0987',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialIngredients: Ingredient[] = [
  { id: 'ing-1', name: 'Café Molido de Especialidad', unit: 'g', currentStock: 4500, minStock: 1000, costPerUnit: 0.35, category: 'granos' },
  { id: 'ing-2', name: 'Leche Entera Organica', unit: 'ml', currentStock: 18000, minStock: 5000, costPerUnit: 0.025, category: 'lacteos' },
  { id: 'ing-3', name: 'Leche Deslactosada Light', unit: 'ml', currentStock: 12000, minStock: 4000, costPerUnit: 0.028, category: 'lacteos' },
  { id: 'ing-4', name: 'Azúcar Morena Especial', unit: 'g', currentStock: 3000, minStock: 800, costPerUnit: 0.04, category: 'granos' },
  { id: 'ing-5', name: 'Vasos Medianos 12oz', unit: 'pza', currentStock: 120, minStock: 200, costPerUnit: 2.50, category: 'desechables' }, // Alerta bajo stock
  { id: 'ing-6', name: 'Vasos Grandes 16oz', unit: 'pza', currentStock: 350, minStock: 150, costPerUnit: 3.10, category: 'desechables' },
  { id: 'ing-7', name: 'Tapas Universales', unit: 'pza', currentStock: 480, minStock: 200, costPerUnit: 1.20, category: 'desechables' },
  { id: 'ing-8', name: 'Jarabe de Chocolate Artesanal', unit: 'ml', currentStock: 1500, minStock: 500, costPerUnit: 0.12, category: 'jarabes' },
  { id: 'ing-9', name: 'Jarabe Vainilla Bourbon', unit: 'ml', currentStock: 400, minStock: 600, costPerUnit: 0.15, category: 'jarabes' }, // Alerta bajo stock
  { id: 'ing-10', name: 'Té Chai Mix Concentrado', unit: 'g', currentStock: 2500, minStock: 800, costPerUnit: 0.22, category: 'granos' },
  { id: 'ing-11', name: 'Pan de Croissant Mantequilla', unit: 'pza', currentStock: 25, minStock: 10, costPerUnit: 12.00, category: 'panaderia' },
  { id: 'ing-12', name: 'Pan Ciabatta Panini', unit: 'pza', currentStock: 18, minStock: 10, costPerUnit: 14.00, category: 'panaderia' },
  { id: 'ing-13', name: 'Queso Gouda Rebanado', unit: 'g', currentStock: 1200, minStock: 500, costPerUnit: 0.18, category: 'perecederos' },
  { id: 'ing-14', name: 'Jamón Selva Negra', unit: 'g', currentStock: 1500, minStock: 500, costPerUnit: 0.22, category: 'perecederos' }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    code: 'CAF-001',
    name: 'Café Americano (12oz)',
    category: 'cafe_caliente',
    price: 45,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-1'
  },
  {
    id: 'prod-2',
    code: 'CAF-002',
    name: 'Espresso Doble',
    category: 'cafe_caliente',
    price: 38,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-2'
  },
  {
    id: 'prod-3',
    code: 'CAF-003',
    name: 'Caffè Latte (16oz)',
    category: 'cafe_caliente',
    price: 58,
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-3'
  },
  {
    id: 'prod-4',
    code: 'CAF-004',
    name: 'Capuchino Italiano',
    category: 'cafe_caliente',
    price: 58,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-4'
  },
  {
    id: 'prod-5',
    code: 'CAF-005',
    name: 'Caffè Mocha Especial',
    category: 'cafe_caliente',
    price: 62,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-5'
  },
  {
    id: 'prod-6',
    code: 'FRI-001',
    name: 'Frappé Moka CODIA',
    category: 'cafe_frio',
    price: 68,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-6'
  },
  {
    id: 'prod-7',
    code: 'FRI-002',
    name: 'Frappé Vainilla Bourbon',
    category: 'cafe_frio',
    price: 68,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-7'
  },
  {
    id: 'prod-8',
    code: 'TE-001',
    name: 'Té Chai Latte Cremoso',
    category: 'te_infusiones',
    price: 55,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-8'
  },
  {
    id: 'prod-9',
    code: 'PAN-001',
    name: 'Croissant Mantequilla French',
    category: 'reposteria',
    price: 42,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-9'
  },
  {
    id: 'prod-10',
    code: 'ALI-001',
    name: 'Panini Clásico Jamón y Queso',
    category: 'alimentos',
    price: 85,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80',
    available: true,
    recipeId: 'rec-10'
  }
];

export const initialRecipes: Recipe[] = [
  {
    id: 'rec-1',
    productId: 'prod-1',
    productName: 'Café Americano (12oz)',
    estimatedCost: 8.80,
    items: [
      { ingredientId: 'ing-1', ingredientName: 'Café Molido de Especialidad', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-5', ingredientName: 'Vasos Medianos 12oz', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-7', ingredientName: 'Tapas Universales', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-2',
    productId: 'prod-2',
    productName: 'Espresso Doble',
    estimatedCost: 6.30,
    items: [
      { ingredientId: 'ing-1', ingredientName: 'Café Molido de Especialidad', quantity: 18, unit: 'g' }
    ]
  },
  {
    id: 'rec-3',
    productId: 'prod-3',
    productName: 'Caffè Latte (16oz)',
    estimatedCost: 18.10,
    items: [
      { ingredientId: 'ing-1', ingredientName: 'Café Molido de Especialidad', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-2', ingredientName: 'Leche Entera Organica', quantity: 300, unit: 'ml' },
      { ingredientId: 'ing-6', ingredientName: 'Vasos Grandes 16oz', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-7', ingredientName: 'Tapas Universales', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-4',
    productId: 'prod-4',
    productName: 'Capuchino Italiano',
    estimatedCost: 15.60,
    items: [
      { ingredientId: 'ing-1', ingredientName: 'Café Molido de Especialidad', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-2', ingredientName: 'Leche Entera Organica', quantity: 220, unit: 'ml' },
      { ingredientId: 'ing-5', ingredientName: 'Vasos Medianos 12oz', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-7', ingredientName: 'Tapas Universales', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-5',
    productId: 'prod-5',
    productName: 'Caffè Mocha Especial',
    estimatedCost: 20.40,
    items: [
      { ingredientId: 'ing-1', ingredientName: 'Café Molido de Especialidad', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-2', ingredientName: 'Leche Entera Organica', quantity: 250, unit: 'ml' },
      { ingredientId: 'ing-8', ingredientName: 'Jarabe de Chocolate Artesanal', quantity: 30, unit: 'ml' },
      { ingredientId: 'ing-6', ingredientName: 'Vasos Grandes 16oz', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-7', ingredientName: 'Tapas Universales', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-6',
    productId: 'prod-6',
    productName: 'Frappé Moka CODIA',
    estimatedCost: 22.80,
    items: [
      { ingredientId: 'ing-1', ingredientName: 'Café Molido de Especialidad', quantity: 20, unit: 'g' },
      { ingredientId: 'ing-2', ingredientName: 'Leche Entera Organica', quantity: 200, unit: 'ml' },
      { ingredientId: 'ing-8', ingredientName: 'Jarabe de Chocolate Artesanal', quantity: 40, unit: 'ml' },
      { ingredientId: 'ing-6', ingredientName: 'Vasos Grandes 16oz', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-7', ingredientName: 'Tapas Universales', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-7',
    productId: 'prod-7',
    productName: 'Frappé Vainilla Bourbon',
    estimatedCost: 21.50,
    items: [
      { ingredientId: 'ing-2', ingredientName: 'Leche Entera Organica', quantity: 250, unit: 'ml' },
      { ingredientId: 'ing-9', ingredientName: 'Jarabe Vainilla Bourbon', quantity: 35, unit: 'ml' },
      { ingredientId: 'ing-6', ingredientName: 'Vasos Grandes 16oz', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-7', ingredientName: 'Tapas Universales', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-8',
    productId: 'prod-8',
    productName: 'Té Chai Latte Cremoso',
    estimatedCost: 17.20,
    items: [
      { ingredientId: 'ing-10', ingredientName: 'Té Chai Mix Concentrado', quantity: 30, unit: 'g' },
      { ingredientId: 'ing-2', ingredientName: 'Leche Entera Organica', quantity: 250, unit: 'ml' },
      { ingredientId: 'ing-6', ingredientName: 'Vasos Grandes 16oz', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-7', ingredientName: 'Tapas Universales', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-9',
    productId: 'prod-9',
    productName: 'Croissant Mantequilla French',
    estimatedCost: 12.00,
    items: [
      { ingredientId: 'ing-11', ingredientName: 'Pan de Croissant Mantequilla', quantity: 1, unit: 'pza' }
    ]
  },
  {
    id: 'rec-10',
    productId: 'prod-10',
    productName: 'Panini Clásico Jamón y Queso',
    estimatedCost: 31.00,
    items: [
      { ingredientId: 'ing-12', ingredientName: 'Pan Ciabatta Panini', quantity: 1, unit: 'pza' },
      { ingredientId: 'ing-13', ingredientName: 'Queso Gouda Rebanado', quantity: 50, unit: 'g' },
      { ingredientId: 'ing-14', ingredientName: 'Jamón Selva Negra', quantity: 60, unit: 'g' }
    ]
  }
];

export const initialClients: Client[] = [
  {
    id: 'cli-1',
    code: 'CLI-8821',
    name: 'Mariana Ríos',
    email: 'mariana.rios@gmail.com',
    phone: '55 1122 3344',
    qrCode: 'CODIA-CLI-8821-QR',
    stamps: 7,
    stampsGoal: 8,
    rewardsAvailable: 0,
    totalVisits: 15,
    totalSpent: 1240,
    tier: 'VIP Consentido',
    lastVisit: '2026-09-30 09:15',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-2',
    code: 'CLI-8822',
    name: 'Roberto Gómez',
    email: 'roberto.g@outlook.com',
    phone: '55 2233 4455',
    qrCode: 'CODIA-CLI-8822-QR',
    stamps: 8,
    stampsGoal: 8,
    rewardsAvailable: 1, // ¡Con recompensa lista!
    totalVisits: 24,
    totalSpent: 1980,
    tier: 'VIP Consentido',
    lastVisit: '2026-09-29 16:30',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-3',
    code: 'CLI-8823',
    name: 'Camila Valenzuela',
    email: 'camila.val@yahoo.com',
    phone: '55 3344 5566',
    qrCode: 'CODIA-CLI-8823-QR',
    stamps: 6,
    stampsGoal: 8,
    rewardsAvailable: 0,
    totalVisits: 9,
    totalSpent: 680,
    tier: 'Frecuente',
    lastVisit: '2026-09-28 11:20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-4',
    code: 'CLI-8824',
    name: 'Fernando Morales',
    email: 'f.morales@techcompany.com',
    phone: '55 4455 6677',
    qrCode: 'CODIA-CLI-8824-QR',
    stamps: 2,
    stampsGoal: 8,
    rewardsAvailable: 0,
    totalVisits: 3,
    totalSpent: 285,
    tier: 'Nuevo',
    lastVisit: '2026-09-30 08:05',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-5',
    code: 'CLI-8825',
    name: 'Valeria Solares',
    email: 'valeria.sol@hotmail.com',
    phone: '55 5566 7788',
    qrCode: 'CODIA-CLI-8825-QR',
    stamps: 8,
    stampsGoal: 8,
    rewardsAvailable: 2, // Recompensa disponible
    totalVisits: 32,
    totalSpent: 2650,
    tier: 'VIP Consentido',
    lastVisit: '2026-09-27 18:00',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-6',
    code: 'CLI-8826',
    name: 'Alejandro Navarrete',
    email: 'alex.nav@gmail.com',
    phone: '55 6677 8899',
    qrCode: 'CODIA-CLI-8826-QR',
    stamps: 1,
    stampsGoal: 8,
    rewardsAvailable: 0,
    totalVisits: 1,
    totalSpent: 85,
    tier: 'Nuevo',
    lastVisit: '2026-09-25 14:10',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-7',
    code: 'CLI-8827',
    name: 'Beatriz Villanueva',
    email: 'bety.villa@gmail.com',
    phone: '55 7788 9900',
    qrCode: 'CODIA-CLI-8827-QR',
    stamps: 7,
    stampsGoal: 8,
    rewardsAvailable: 0,
    totalVisits: 14,
    totalSpent: 1100,
    tier: 'Frecuente',
    lastVisit: '2026-09-30 10:45',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-8',
    code: 'CLI-8828',
    name: 'Daniel Ortega',
    email: 'dortega@designlab.io',
    phone: '55 8899 0011',
    qrCode: 'CODIA-CLI-8828-QR',
    stamps: 4,
    stampsGoal: 8,
    rewardsAvailable: 0,
    totalVisits: 6,
    totalSpent: 430,
    tier: 'Frecuente',
    lastVisit: '2026-09-20 12:15',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialPromotions: Promotion[] = [
  {
    id: 'prom-1',
    title: 'Doble Sello de Fidelidad los Viernes',
    description: 'Acumula 2 sellos en tu tarjeta digital en todas tus compras superiores a $100 MXN durante todo el viernes.',
    audience: 'todos',
    validUntil: '2026-12-31',
    active: true,
    code: 'VIERNES2X',
    bonusStamps: 1
  },
  {
    id: 'prom-2',
    title: '15% OFF en Bebidas Frías y Frappés',
    description: 'Descuento especial exclusivo para nuestros clientes frecuentes y VIP en cualquier frappé o iced coffee.',
    audience: 'frecuentes',
    validUntil: '2026-10-31',
    active: true,
    code: 'FRIO15',
    discountPercentage: 15
  },
  {
    id: 'prom-3',
    title: 'Croissant Gratis al desbloquear Recompensa',
    description: 'Recibe un Croissant de mantequilla recién horneado de regalo al canjear tu recompensa de 8 sellos.',
    audience: 'proximos_recompensa',
    validUntil: '2026-11-15',
    active: true,
    code: 'RECOMPENSA_PLUS',
    freeItem: 'Croissant Mantequilla'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    date: '2026-09-30',
    checkIn: '06:55',
    checkOut: '16:05',
    status: 'puntual',
    deviceSimulated: 'Hikvision DS-K1T804AM'
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    date: '2026-09-30',
    checkIn: '07:22', // Retardo (Tol 15 min)
    status: 'retardo',
    notes: 'Tráfico pesado en zona centro',
    deviceSimulated: 'Hikvision DS-K1T804AM'
  },
  {
    id: 'att-3',
    employeeId: 'emp-3',
    date: '2026-09-30',
    checkIn: '07:58',
    status: 'puntual',
    deviceSimulated: 'Hikvision DS-K1T804AM'
  },
  {
    id: 'att-4',
    employeeId: 'emp-4',
    date: '2026-09-30',
    status: 'ausente',
    notes: 'No reportó ingreso al momento',
    deviceSimulated: 'Hikvision DS-K1T804AM'
  },
  {
    id: 'att-5',
    employeeId: 'emp-5',
    date: '2026-09-30',
    checkIn: '07:50',
    status: 'puntual',
    deviceSimulated: 'Hikvision DS-K1T804AM'
  },
  {
    id: 'att-6',
    employeeId: 'emp-6',
    date: '2026-09-30',
    checkIn: '06:58',
    status: 'puntual',
    deviceSimulated: 'Hikvision DS-K1T804AM'
  }
];

export const initialSales: Sale[] = [
  {
    id: 'sale-1',
    folio: 'VTA-1049',
    timestamp: '2026-09-30 08:15',
    items: [
      { productId: 'prod-3', productName: 'Caffè Latte (16oz)', price: 58, quantity: 2 },
      { productId: 'prod-9', productName: 'Croissant Mantequilla French', price: 42, quantity: 2 }
    ],
    subtotal: 200,
    discount: 0,
    total: 200,
    paymentMethod: 'tarjeta',
    clientId: 'cli-1',
    clientName: 'Mariana Ríos',
    stampsEarned: 1
  },
  {
    id: 'sale-2',
    folio: 'VTA-1050',
    timestamp: '2026-09-30 09:30',
    items: [
      { productId: 'prod-6', productName: 'Frappé Moka CODIA', price: 68, quantity: 1 },
      { productId: 'prod-10', productName: 'Panini Clásico Jamón y Queso', price: 85, quantity: 1 }
    ],
    subtotal: 153,
    discount: 0,
    total: 153,
    paymentMethod: 'efectivo',
    clientId: 'cli-4',
    clientName: 'Fernando Morales',
    stampsEarned: 1
  },
  {
    id: 'sale-3',
    folio: 'VTA-1051',
    timestamp: '2026-09-30 10:45',
    items: [
      { productId: 'prod-1', productName: 'Café Americano (12oz)', price: 45, quantity: 3 },
      { productId: 'prod-8', productName: 'Té Chai Latte Cremoso', price: 55, quantity: 1 }
    ],
    subtotal: 190,
    discount: 0,
    total: 190,
    paymentMethod: 'tarjeta',
    clientId: 'cli-7',
    clientName: 'Beatriz Villanueva',
    stampsEarned: 1
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    folio: 'EGR-801',
    date: '2026-09-30',
    supplier: 'Distribuidora de Café Gourmet S.A. de C.V.',
    category: 'insumos',
    description: 'Compra de 10kg Café en Grano Tostado Especial',
    subtotal: 2800,
    tax: 448,
    total: 3248,
    ocrScanned: true
  },
  {
    id: 'exp-2',
    folio: 'EGR-802',
    date: '2026-09-29',
    supplier: 'Lácteos Altiplano',
    category: 'insumos',
    description: 'Suministro semanal de leche orgánica y entera',
    subtotal: 1500,
    tax: 0,
    total: 1500,
    ocrScanned: true
  },
  {
    id: 'exp-3',
    folio: 'EGR-803',
    date: '2026-09-28',
    supplier: 'CFE Suministrador Básico',
    category: 'servicios',
    description: 'Pago bimestral de energía eléctrica sucursal',
    subtotal: 4200,
    tax: 672,
    total: 4872,
    ocrScanned: false
  }
];

export const initialMovements: InventoryMovement[] = [
  {
    id: 'mov-1',
    timestamp: '2026-09-30 08:15',
    ingredientId: 'ing-1',
    ingredientName: 'Café Molido de Especialidad',
    type: 'salida',
    quantity: 36,
    unit: 'g',
    reason: 'Venta VTA-1049 (2 Lattes)'
  },
  {
    id: 'mov-2',
    timestamp: '2026-09-30 08:15',
    ingredientId: 'ing-2',
    ingredientName: 'Leche Entera Organica',
    type: 'salida',
    quantity: 600,
    unit: 'ml',
    reason: 'Venta VTA-1049 (2 Lattes)'
  },
  {
    id: 'mov-3',
    timestamp: '2026-09-30 09:00',
    ingredientId: 'ing-5',
    ingredientName: 'Vasos Medianos 12oz',
    type: 'entrada',
    quantity: 50,
    unit: 'pza',
    reason: 'Ajuste de inventario recibido'
  }
];
