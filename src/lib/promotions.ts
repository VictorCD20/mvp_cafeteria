import { Client, Product, Promotion } from '../types';
import { daysAgoInMexico, isFridayInMexico, todayInMexico } from './dates';

export { isFridayInMexico, todayInMexico };

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface AppliedPromotion {
  code: string;
  title: string;
  detail: string;
}

export interface SaleQuote {
  subtotal: number;
  discount: number;
  total: number;
  stamps: number;
  applied: AppliedPromotion[];
}

/** Días sin visita para considerar a un cliente "inactivo". */
export const INACTIVE_AFTER_DAYS = 30;
/** Sellos faltantes para considerar a un cliente "próximo a recompensa". */
export const NEAR_REWARD_STAMPS = 2;

export const isPromotionValid = (promo: Promotion, today: string = todayInMexico()) =>
  promo.active && promo.validUntil >= today;

/** ¿La promoción va dirigida a este cliente? Fuente única para el POS y la vista del cliente. */
export const matchesAudience = (promo: Promotion, client?: Client, date: Date = new Date()) => {
  if (promo.audience === 'todos') return true;
  if (!client) return false;
  switch (promo.audience) {
    case 'frecuentes':
      return client.tier === 'Frecuente' || client.tier === 'VIP Consentido';
    case 'nuevos':
      return client.tier === 'Nuevo';
    case 'proximos_recompensa':
      return client.stampsGoal - client.stamps <= NEAR_REWARD_STAMPS || client.rewardsAvailable > 0;
    case 'inactivos':
      return client.lastVisit.slice(0, 10) < daysAgoInMexico(INACTIVE_AFTER_DAYS, date);
    default:
      return false;
  }
};

/** Promociones vigentes que le aplican a un cliente. */
export const promotionsForClient = (promotions: Promotion[], client?: Client, date: Date = new Date()) =>
  promotions.filter((p) => isPromotionValid(p, todayInMexico(date)) && matchesAudience(p, client, date));

/**
 * Calcula el total de una venta aplicando las promociones vigentes.
 * - Descuento por porcentaje: sobre las categorías de `appliesTo` (o todo el ticket si no se indican).
 * - Sellos extra (bonusStamps): si hay cliente, respetando `fridayOnly` (hora de México) y `minPurchase`.
 * - Producto de regalo (freeItem): se entrega al canjear la recompensa, no cambia el total.
 */
export const quoteSale = (
  lines: CartLine[],
  promotions: Promotion[],
  client?: Client,
  options: { date?: Date; forceFriday?: boolean } = {}
): SaleQuote => {
  const date = options.date ?? new Date();
  const friday = options.forceFriday || isFridayInMexico(date);

  const subtotal = lines.reduce((acc, l) => acc + l.product.price * l.quantity, 0);
  let discount = 0;
  let stamps = client ? 1 : 0;
  const applied: AppliedPromotion[] = [];

  promotionsForClient(promotions, client, date).forEach((promo) => {
    if (promo.discountPercentage) {
      const base = lines
        .filter((l) => !promo.appliesTo?.length || promo.appliesTo.includes(l.product.category))
        .reduce((acc, l) => acc + l.product.price * l.quantity, 0);
      const amount = Math.min(Math.round((base * promo.discountPercentage) / 100), subtotal - discount);
      if (amount > 0) {
        discount += amount;
        applied.push({ code: promo.code, title: promo.title, detail: `-$${amount} MXN` });
      }
    }
    if (promo.bonusStamps && client && (!promo.fridayOnly || friday) && subtotal > (promo.minPurchase ?? 0)) {
      stamps += promo.bonusStamps;
      applied.push({ code: promo.code, title: promo.title, detail: `+${promo.bonusStamps} sello extra` });
    }
  });

  return { subtotal, discount, total: subtotal - discount, stamps, applied };
};
