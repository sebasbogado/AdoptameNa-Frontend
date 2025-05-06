

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatNumber = (value: number) => {
  return value.toLocaleString('es-PY');
}