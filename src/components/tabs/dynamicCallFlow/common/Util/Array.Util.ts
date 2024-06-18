
/**
 * @typedef {ElementType} ElementType
 */

export function addElementToArray<ElementType>(recordToAdd: ElementType, target: Array<ElementType>): Array<ElementType> {
  return [ ...target, recordToAdd ];
}

export function addElementsToArray<Type>(newElements: Array<Type>, target: Array<Type>): Array<Type> {
  return [ ...target, ...newElements ];
}

export function updateElementInArray<ElementType>(elementKey: string, updatedElement: ElementType, target: Array<ElementType>): Array<ElementType> {
  return target.map( existingElement => existingElement[elementKey as keyof ElementType] === updatedElement[elementKey as keyof ElementType] ? updatedElement : existingElement);
}

export function updateElementsInArray<ElementType>(elementKey: string, updatedElements: Array<ElementType>, targetElements: Array<ElementType>): Array<ElementType> {
  return targetElements.map(targetElement => {
    const updatedElement = updatedElements.find(updatedElement => updatedElement[elementKey as keyof ElementType] === targetElement[elementKey as keyof ElementType]);

    //remove updatedRecord from updatedRecordsCopy array to speed up the find for future iterations by reducing updatedRecordsCopy array size
    return updatedElement || targetElement;
  });
}

export function removeElementFromArray<ElementType>(elementUniqueKey: string, elementToRemove: ElementType, targetArray: Array<ElementType>): Array<ElementType> {
  return targetArray.filter( targetElement => targetElement[elementUniqueKey as keyof ElementType] !== elementToRemove[elementUniqueKey as keyof ElementType]);
}

export function removeElementsFromArray<ElementType>(elementUniqueKey: string, elementsToRemoveFromTargetArray: Array<ElementType>, targetArray: Array<ElementType>): Array<ElementType> {
  // Filter the targetArray to keep targetElements that do not exist in the elementsToRemoveFromTargetArray
  return targetArray.filter( targetElement => elementDoesNotExistInArray(elementUniqueKey, targetElement, elementsToRemoveFromTargetArray));
}

export function elementExistsInArray<ElementType>(elementUniqueKey: string, elementToCheckIfItExistsInArray: ElementType, targetArrayToCheck: Array<ElementType>): boolean {
  return targetArrayToCheck.some(targetArrayElement =>
    targetArrayElement[elementUniqueKey as keyof typeof targetArrayElement] === elementToCheckIfItExistsInArray[elementUniqueKey as keyof typeof elementToCheckIfItExistsInArray]);
}

function elementDoesNotExistInArray<ElementType>(elementUniqueKey: string, elementToCheckIfItDoesNotExistInArray: ElementType, targetArrayToCheck: any[]): boolean {
  return !elementExistsInArray(elementUniqueKey, elementToCheckIfItDoesNotExistInArray, targetArrayToCheck);
}