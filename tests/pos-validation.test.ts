import test from 'node:test';
import assert from 'node:assert/strict';
import type { Product } from '../src/types';



interface ValidationResult {
  valid: boolean;
  error?: string;
}

const validatePosSalePayload = (
  items: { product: Product; quantity: number }[]
): ValidationResult => {
  if (!items || items.length === 0) {
    return { valid: false, error: 'El carrito está vacío' };
  }

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { valid: false, error: `Cantidad inválida para ${item.product.name}` };
    }
    if (item.product.available === false) {
      return { valid: false, error: `El producto "${item.product.name}" está marcado como no disponible` };
    }
  }

  return { valid: true };
};

const mockAvailableProd: Product = {
  id: 'prod-1',
  code: 'PROD-001',
  name: 'Capuccino',
  category: 'cafe_caliente',
  price: 60,
  image: '',
  available: true
};

const mockUnavailableProd: Product = {
  id: 'prod-2',
  code: 'PROD-002',
  name: 'Cheesecake Frutos Rojos',
  category: 'reposteria',
  price: 75,
  image: '',
  available: false
};

test('Rechaza carrito vacío', () => {
  const res = validatePosSalePayload([]);
  assert.equal(res.valid, false);
  assert.equal(res.error, 'El carrito está vacío');
});

test('Rechaza cantidades cero o negativas', () => {
  const resZero = validatePosSalePayload([{ product: mockAvailableProd, quantity: 0 }]);
  assert.equal(resZero.valid, false);

  const resNeg = validatePosSalePayload([{ product: mockAvailableProd, quantity: -2 }]);
  assert.equal(resNeg.valid, false);
});

test('Rechaza cantidades decimales (no enteras)', () => {
  const res = validatePosSalePayload([{ product: mockAvailableProd, quantity: 1.5 }]);
  assert.equal(res.valid, false);
  assert.match(res.error || '', /Cantidad inválida/);
});

test('Rechaza productos marcados como no disponibles', () => {
  const res = validatePosSalePayload([
    { product: mockAvailableProd, quantity: 1 },
    { product: mockUnavailableProd, quantity: 1 }
  ]);
  assert.equal(res.valid, false);
  assert.match(res.error || '', /está marcado como no disponible/);
});

test('Acepta payload válido con producto disponible y cantidad entera positiva', () => {
  const res = validatePosSalePayload([{ product: mockAvailableProd, quantity: 2 }]);
  assert.equal(res.valid, true);
});
