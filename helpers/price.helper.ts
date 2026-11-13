/** SauceDemo applies a flat 8% tax (assumption, see README). */
export const TAX_RATE = 0.08;

/** Parses a SauceDemo price such as "$29.99" (or "Item total: $29.99") into integer cents. */
export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+)\.(\d{2})/);
  if (!match) throw new Error(`Cannot parse a price from "${text}"`);
  return Number(match[1]) * 100 + Number(match[2]);
}

/** Formats integer cents as "$12.34". */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export interface ExpectedTotals {
  itemTotal: number;
  tax: number;
  total: number;
}

/** Computes the expected overview totals in cents. Integer maths avoids floating-point drift. */
export function expectedTotals(pricesInCents: number[]): ExpectedTotals {
  const itemTotal = pricesInCents.reduce((sum, price) => sum + price, 0);
  const tax = Math.round(itemTotal * TAX_RATE);
  return { itemTotal, tax, total: itemTotal + tax };
}
