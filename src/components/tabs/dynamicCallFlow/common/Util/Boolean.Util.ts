export const BOOLEAN_TYPE = "boolean";
export const BOOLEAN_STRING_TRUE = "TRUE";
export const BOOLEAN_STRING_FALSE = "FALSE";
export const BOOLEAN_NUMBER_TRUE = 1;
export const BOOLEAN_NUMBER_FALSE = 0;
export const BOOLEAN_TRUE_VALUES: Array<boolean | string | number> = [true, "true", "True", "TRUE", 1, "1"];
export const BOOLEAN_FALSE_VALUES: Array<boolean | string | number> = [false, "false", "False", "FALSE", 0, "0"];
export const BOOLEAN_VALUES: Array<boolean | string | number> = [...BOOLEAN_TRUE_VALUES, ...BOOLEAN_FALSE_VALUES];

export function isBooleanType(value: unknown): boolean {
  return typeof value === BOOLEAN_TYPE;
}

export function isNotBooleanType(value: unknown): boolean {
  return !isBooleanType(value);
}

export function isBooleanValue(value: boolean | string | number): boolean {
  return BOOLEAN_VALUES.includes(value);
}

export function isNotBooleanValue(value: boolean | string | number): boolean {
  return !isBooleanValue(value);
}

export function isTrue(value: boolean | string | number): boolean {
  return BOOLEAN_TRUE_VALUES.includes(value);
}

export function isFalse(value: boolean | string | number): boolean {
  return BOOLEAN_FALSE_VALUES.includes(value);
}

export function booleanValue(value: string | number): boolean {
  return isTrue(value);
}

export function booleanAsString(value: boolean | number): string {
  return value ? BOOLEAN_STRING_TRUE : BOOLEAN_STRING_FALSE;
}

export function booleanAsNumber(value: boolean | string): number {
  return BOOLEAN_TRUE_VALUES.includes(value) ? BOOLEAN_NUMBER_TRUE : BOOLEAN_NUMBER_FALSE;
}