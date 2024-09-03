export const OBJECT_TYPE = "object";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function keyExists(object: any, key: string): boolean {
  if (typeof object !== OBJECT_TYPE || object === null) {
    return false;
  }
  return key in object;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function keyDoesNotExist(object: any, key: string): boolean {
  return !keyExists(object, key);
}
