export function isBoolean(value: unknown): boolean {
  return typeof value === "boolean";
}

export function isNotBoolean(value: unknown): boolean {
  return !isBoolean(value);
}

export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

export function isNotArray(value: unknown): boolean {
  return !isArray(value);
}