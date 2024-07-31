/**
 * Creates a deep copy of an object.
 * Preserves TypeScript types via generic type parameter.
 * @param { T } objectToCopy Object to copy
 * @returns { T } Deep copy of object
 */
export const deepCopyObject = <T>(objectToCopy: T): T => {
  return JSON.parse(JSON.stringify(objectToCopy)) as T;
};
