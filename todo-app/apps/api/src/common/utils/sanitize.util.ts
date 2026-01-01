export function sanitizeString(value: string): string {
  return value.replace(/[<>]/g, '').trim();
}
