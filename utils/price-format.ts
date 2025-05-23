/**
 * Formatea un número a string en formato de precio paraguayo (con separador de miles y prefijo ₲).
 * @param value Número a formatear
 * @param withSymbol Si true, antepone ₲
 * @returns string formateado
 */
export function formatPrice(value: number | null | undefined, withSymbol = true): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  const formatted = value.toLocaleString('es-PY');
  return withSymbol ? `₲ ${formatted}` : formatted;
}