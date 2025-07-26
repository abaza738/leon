/**
 * Format price for display with JD currency
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} JD`
}

/**
 * Format ID for display
 */
export function formatId(id: string): string {
  return `#${id.slice(0, 10)}`
}
