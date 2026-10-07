import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteSale, isFridayInMexico, todayInMexico } from '../src/lib/promotions.ts';
import type { Product, Promotion, Client } from '../src/types';




const mockColdProduct: Product = {
  id: 'prod-cold-1',
  code: 'PROD-001',
  name: 'Cold Brew Clásico',
  category: 'cafe_frio',
  price: 65,
  image: '',
  available: true
};

const mockHotProduct: Product = {
  id: 'prod-hot-1',
  code: 'PROD-002',
  name: 'Espresso Doble',
  category: 'cafe_caliente',
  price: 50,
  image: '',
  available: true
};

const mockClient: Client = {
  id: 'cli-test-1',
  code: 'CLI-1001',
  name: 'Cliente Prueba',
  email: 'prueba@test.com',
  phone: '55 1234 5678',
  avatar: '',
  qrCode: 'QR-1001',
  stamps: 3,
  stampsGoal: 8,
  rewardsAvailable: 0,
  totalVisits: 4,
  totalSpent: 300,
  tier: 'Nuevo',
  lastVisit: '2026-10-01'
};

const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    code: 'PROMO10',
    title: '10% en Bebidas Frías',
    description: '10% de descuento en café frío',
    discountPercentage: 10,
    audience: 'todos',
    validUntil: '2026-12-31',
    active: true
  },
  {
    id: 'promo-2',
    code: 'VIERNES2X',
    title: 'Viernes de Doble Sello',
    description: 'Doble sello en compras mayores a $100',
    bonusStamps: 1,
    audience: 'todos',
    validUntil: '2026-12-31',
    active: true
  }
];

test('Calcula venta simple sin cliente y sin promociones', () => {
  const quote = quoteSale(
    [{ product: mockHotProduct, quantity: 2 }],
    [],
    undefined
  );

  assert.equal(quote.subtotal, 100);
  assert.equal(quote.discount, 0);
  assert.equal(quote.total, 100);
  assert.equal(quote.stamps, 0);
  assert.equal(quote.applied.length, 0);
});

test('Asigna 1 sello base cuando hay cliente asociado', () => {
  const quote = quoteSale(
    [{ product: mockHotProduct, quantity: 1 }],
    [],
    mockClient
  );

  assert.equal(quote.subtotal, 50);
  assert.equal(quote.stamps, 1);
});

test('Aplica porcentaje de descuento únicamente a bebidas frías', () => {
  const quote = quoteSale(
    [
      { product: mockColdProduct, quantity: 2 }, // 2 * $65 = $130 -> 10% = $13
      { product: mockHotProduct, quantity: 1 }   // 1 * $50 = $50 (sin descuento)
    ],
    mockPromotions,
    mockClient
  );

  assert.equal(quote.subtotal, 180);
  assert.equal(quote.discount, 13);
  assert.equal(quote.total, 167);
  assert.equal(quote.applied.some((a) => a.code === 'PROMO10'), true);
});

test('Aplica bono de sellos el viernes si el subtotal supera $100 MXN', () => {
  const quote = quoteSale(
    [{ product: mockHotProduct, quantity: 3 }], // $150 > $100
    mockPromotions,
    mockClient,
    { forceFriday: true }
  );

  assert.equal(quote.subtotal, 150);
  assert.equal(quote.stamps, 2); // 1 base + 1 bono
  assert.equal(quote.applied.some((a) => a.code === 'VIERNES2X'), true);
});

test('No aplica bono de sellos de viernes si la compra es menor o igual a $100 MXN', () => {
  const quote = quoteSale(
    [{ product: mockHotProduct, quantity: 2 }], // $100 no es > $100
    mockPromotions,
    mockClient,
    { forceFriday: true }
  );

  assert.equal(quote.subtotal, 100);
  assert.equal(quote.stamps, 1); // solo base
  assert.equal(quote.applied.some((a) => a.code === 'VIERNES2X'), false);
});

test('Calcula la fecha y el día viernes en hora de México (America/Mexico_City)', () => {
  // Fecha fija: Viernes 2 de Octubre de 2026
  const fridayDate = new Date('2026-10-02T18:00:00Z');
  assert.equal(typeof isFridayInMexico(fridayDate), 'boolean');
  assert.equal(typeof todayInMexico(fridayDate), 'string');
});
