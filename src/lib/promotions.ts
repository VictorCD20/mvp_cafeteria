import type { Client, Product, Promotion } from '../types';


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

const TIME_ZONE = 'America/Mexico_City';

/** Fecha de hoy en hora de México (YYYY-MM-DD), no UTC. */
export const todayInMexico = (date: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date);

/** true si la fecha cae en viernes en hora de México. */
export const isFridayInMexico = (date: Date = new Date()): boolean =>
  new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, weekday: 'short' }).format(date) === 'Fri';

const isPromotionValid = (promo: Promotion, today: string) => promo.active && promo.validUntil >= today;

const matchesAudience = (promo: Promotion, client?: Client) => {
  switch (promo.audience) {
    case 'todos':
      return true;
    case 'frecuentes':
      return Boolean(client && (client.tier === 'Frecuente' || client.tier === 'VIP Consentido'));
    case 'nuevos':
      return Boolean(client && client.tier === 'Nuevo');
    default:
      return false;
  }
};

const MIN_TOTAL_DOUBLE_STAMP = 100;

/**
 * Calcula el total de una venta aplicando las promociones vigentes.
 * - Descuento por porcentaje: aplica solo a bebidas frías (cafe_frio) del público objetivo.
 * - Sellos extra (bonusStamps): aplica los viernes (hora de México) en compras mayores a $100.
 * Los sellos solo se suman si hay un cliente asociado.
 */
export const quoteSale = (
  lines: CartLine[],
  promotions: Promotion[],
  client?: Client,
  options: { date?: Date; forceFriday?: boolean } = {}
): SaleQuote => {
  const date = options.date ?? new Date();
  const today = todayInMexico(date);
  const friday = options.forceFriday || isFridayInMexico(date);

  const subtotal = lines.reduce((acc, l) => acc + l.product.price * l.quantity, 0);
  let discount = 0;
  let stamps = client ? 1 : 0;
  const applied: AppliedPromotion[] = [];

  promotions
    .filter((p) => isPromotionValid(p, today) && matchesAudience(p, client))
    .forEach((promo) => {
      if (promo.discountPercentage) {
        const coldTotal = lines
          .filter((l) => l.product.category === 'cafe_frio')
          .reduce((acc, l) => acc + l.product.price * l.quantity, 0);
        const amount = Math.round((coldTotal * promo.discountPercentage) / 100);
        if (amount > 0) {
          discount += amount;
          applied.push({ code: promo.code, title: promo.title, detail: `-$${amount} MXN` });
        }
      }
      if (promo.bonusStamps && client && friday && subtotal > MIN_TOTAL_DOUBLE_STAMP) {
        stamps += promo.bonusStamps;
        applied.push({ code: promo.code, title: promo.title, detail: `+${promo.bonusStamps} sello extra` });
      }
    });

  return { subtotal, discount, total: subtotal - discount, stamps, applied };
};
