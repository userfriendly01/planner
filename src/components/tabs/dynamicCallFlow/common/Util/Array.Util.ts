export type MatchFilter<RecordType> = (record1: RecordType, record2: RecordType) => boolean;

/**
 * @typedef {ElementType} ElementType
 */

export function addElementToArray<ElementType>(recordToAdd: ElementType, targetArray: Array<ElementType>): Array<ElementType> {
  return [ ...targetArray, recordToAdd ];
}

export function addElementsToArray<ElementType>(newElements: Array<ElementType>, targetArray: Array<ElementType>): Array<ElementType> {
  return [ ...targetArray, ...newElements ];
}

export function updateElementInArray<ElementType>(elementKey: string, updatedElement: ElementType, targetArray: Array<ElementType>): Array<ElementType> {
  return targetArray.map( existingElement => elementsMatch(elementKey, existingElement, updatedElement) ? updatedElement : existingElement);
}

export function updateElementsInArray<ElementType>(elementKey: string, updatedElements: Array<ElementType>, targetArray: Array<ElementType>): Array<ElementType> {
  return targetArray.map(targetElement =>
    updatedElements.find(updatedElement => elementsMatch(elementKey, targetElement, updatedElement)) || targetElement);
}

export function removeElementFromArray<ElementType>(elementUniqueKey: string, elementToRemoveFromTargetArray: ElementType, targetArray: Array<ElementType>): Array<ElementType> {
  return targetArray.filter( targetElement => elementsDoNotMatch(elementUniqueKey, targetElement, elementToRemoveFromTargetArray));
}

export function removeElementsFromArray<ElementType>(elementUniqueKey: string, elementsToRemoveFromTargetArray: Array<ElementType>, targetArray: Array<ElementType>): Array<ElementType> {
  // Filter the targetArray to keep targetElements that do not exist in the elementsToRemoveFromTargetArray, thus removing the elementsToRemoveFromTargetArray from the targetArray
  return targetArray.filter( targetElement => elementDoesNotExistInArray(elementUniqueKey, targetElement, elementsToRemoveFromTargetArray));
}

export function elementExistsInArray<ElementType>(elementUniqueKey: string, elementToCheckIfItExistsInArray: ElementType, targetArrayToCheck: Array<ElementType>): boolean {
  return targetArrayToCheck.some(targetArrayElement => elementsMatch(elementUniqueKey, targetArrayElement, elementToCheckIfItExistsInArray));
}

export function elementDoesNotExistInArray<ElementType>(elementUniqueKey: string, elementToCheckIfItDoesNotExistInArray: ElementType, targetArrayToCheck: any[]): boolean {
  return !elementExistsInArray(elementUniqueKey, elementToCheckIfItDoesNotExistInArray, targetArrayToCheck);
}

function elementsMatch(elementUniqueKey: string, elementOne: any, elementTwo: any): boolean {
  return elementOne[elementUniqueKey as keyof typeof elementOne] === elementTwo[elementUniqueKey as keyof typeof elementTwo];
}

function elementsDoNotMatch(elementUniqueKey: string, elementOne: any, elementTwo: any): boolean {
  return !elementsMatch(elementUniqueKey, elementOne, elementTwo);
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
  return elementsToMatch.filter((elementToMatch: ElementType) => matchFound(listToSearchIn, elementToMatch, matchFilter));
}

/**
 * Check if matching record found
 * @param {Array<ElementType>} listToSearchIn - List of elements to search through to see if any records match the matchCandidate
 * @param {ElementType} elementToMatch - phone number record candidate to match against
 * @param {MatchFilter} matchFilter - Filter to use to match records
 * @return {boolean} - True if matching record found, false otherwise
 */
function matchFound<ElementType>(listToSearchIn: Array<ElementType>, elementToMatch: ElementType, matchFilter: MatchFilter<ElementType>): boolean {
  return listToSearchIn.some( listToSearchInElement =>  matchFilter(listToSearchInElement, elementToMatch));
}