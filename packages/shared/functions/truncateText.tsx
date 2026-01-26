export function truncate(str: string, maxLength = 30) {
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}