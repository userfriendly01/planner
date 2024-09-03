export type MatchFilter<RecordType> = (record1: RecordType, record2: RecordType) => boolean;

/**
 * @typedef {ElementType} ElementType
 */

export function stringToArray(value: string): string[] {
  return typeof value === "string" && String(value).trim().length > 0 ? value?.split(",") : [];
}

export function addElementToArray<ElementType>(recordToAdd: ElementType, targetArray: Array<ElementType>): Array<ElementType> {
  return addElementsToArray([recordToAdd], targetArray);
}

export function addElementsToArray<ElementType>(newElements: Array<ElementType>, targetArray: Array<ElementType>): Array<ElementType> {
  if (newElements && targetArray) {
    return [ ...targetArray, ...newElements ];
  } else if (!newElements) {
    return targetArray;
  } else if (!targetArray) {
    return newElements;
  }

  return null;
}

export function updateElementInArray<ElementType>(matchFilter: MatchFilter<ElementType>, updatedElement: ElementType, targetArray: Array<ElementType>): Array<ElementType> {
  // return targetArray?.map( existingElement => elementsMatch(elementKey, existingElement, updatedElement) ? updatedElement : existingElement);
  return updateElementsInArray(matchFilter, [updatedElement], targetArray);
}

export function updateElementsInArray<ElementType>(matchFilter: MatchFilter<ElementType>, updatedElements: Array<ElementType>, targetArray: Array<ElementType>): Array<ElementType> {
  if (!updatedElements) {
    return targetArray;
  }

  if (!targetArray) {
    return updatedElements;
  }

  return targetArray?.map(existingElement =>
    updatedElements?.find(updatedElement => elementsMatch(matchFilter, existingElement, updatedElement)) || existingElement);
}

export function removeElementFromArray<ElementType>(matchFilter: MatchFilter<ElementType>, elementToRemoveFromTargetArray: ElementType, targetArray: Array<ElementType>): Array<ElementType> {
  if (!elementToRemoveFromTargetArray) {
    return targetArray;
  }

  if (!targetArray) {
    return [];
  }

  return targetArray?.filter( targetElement => elementsDoNotMatch(matchFilter, targetElement, elementToRemoveFromTargetArray));
}

export function removeElementsFromArray<ElementType>(matchFilter: MatchFilter<ElementType>, elementsToRemoveFromTargetArray: Array<ElementType>, targetArray: Array<ElementType>): Array<ElementType> {
  if (!elementsToRemoveFromTargetArray) {
    return targetArray;
  }

  if (!targetArray) {
    return [];
  }

  // Filter the targetArray to keep targetElements that do not exist in the elementsToRemoveFromTargetArray, thus removing the elementsToRemoveFromTargetArray from the targetArray
  return targetArray?.filter( targetElement => elementDoesNotExistInArray(matchFilter, targetElement, elementsToRemoveFromTargetArray));
}

export function elementExistsInArray<ElementType>(matchFilter: MatchFilter<ElementType>, elementToCheckIfItExistsInArray: ElementType, targetArrayToCheck: Array<ElementType>): boolean {
  if (!matchFilter || !elementToCheckIfItExistsInArray || !targetArrayToCheck) {
    return false;
  }

  return targetArrayToCheck?.some(targetArrayElement => matchFilter(targetArrayElement, elementToCheckIfItExistsInArray));
}

export function elementDoesNotExistInArray<ElementType>(matchFilter: MatchFilter<ElementType>, elementToCheckIfItDoesNotExistInArray: ElementType, targetArrayToCheck: any[]): boolean {
  return !elementExistsInArray(matchFilter, elementToCheckIfItDoesNotExistInArray, targetArrayToCheck);
}

/**
 * Checks if two elements match based on a unique key.
 *
 * @param {MatchFilter<ElementType>} matchFilter - The unique key to compare the elements.
 * @param {any} elementOne - The first element to compare.
 * @param {any} elementTwo - The second element to compare.
 * @returns {boolean} - Returns true if both elements match based on the unique key, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function elementsMatch<ElementType>(matchFilter: MatchFilter<ElementType>, elementOne: ElementType, elementTwo: ElementType): boolean {
  if (!matchFilter || !elementOne || !elementTwo) {
    return false;
  }

  return matchFilter(elementOne, elementTwo);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function elementsDoNotMatch(matchFilter: MatchFilter<any>, elementOne: any, elementTwo: any): boolean {
  return !elementsMatch(matchFilter, elementOne, elementTwo);
}

/**
 * Find matching phone number records
 * @param {Array<ElementType>} listToSearchIn - List of phoneNumberRecords to search through to see if any records in recordsToMatch
 * @param {Array<ElementType>} elementsToMatch - If passing single phoneNumberRecord, pass it as single length array i.e. "[newPhoneNumberRecord]"
 * @param {MatchFilter} matchFilter - Filter to use to match records
 *
 * @return {Array<ElementType>} - List of matching phone number records
 */
export function findMatchingElements<ElementType>(listToSearchIn: Array<ElementType>, elementsToMatch: Array<ElementType>, matchFilter: MatchFilter<ElementType>): Array<ElementType> {
  if (!elementsToMatch || !listToSearchIn || !matchFilter) {
    return [];
  }

  return elementsToMatch?.filter((elementToMatch: ElementType) => matchFound(listToSearchIn, elementToMatch, matchFilter));
}

/**
 * Check if matching record found
 * @param {Array<ElementType>} listToSearchIn - List of elements to search through to see if any records match the matchCandidate
 * @param {ElementType} elementToMatch - phone number record candidate to match against
 * @param {MatchFilter} matchFilter - Filter to use to match records
 * @return {boolean} - True if matching record found, false otherwise
 */
export function matchFound<ElementType>(listToSearchIn: Array<ElementType>, elementToMatch: ElementType, matchFilter: MatchFilter<ElementType>): boolean {
  if (!listToSearchIn || !elementToMatch || !matchFilter) {
    return false;
  }

  return listToSearchIn && elementToMatch && matchFilter
    && listToSearchIn.some( listToSearchInElement =>  matchFilter(listToSearchInElement, elementToMatch));
}

export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

export function isNotArray(value: unknown): boolean {
  return !isArray(value);
}