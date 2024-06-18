
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

export function removeElementFromArray<ElementType>(elementKey: string, elementToRemove: ElementType, targetElements: Array<ElementType>): Array<ElementType> {
  return targetElements.filter( targetElement => targetElement[elementKey as keyof ElementType] !== elementToRemove[elementKey as keyof ElementType]);
}

export function removeElementsFromArray<ElementType>(elementKey: string, elementsToRemove: Array<ElementType>, targetElements: Array<ElementType>): Array<ElementType> {
  return targetElements.filter( targetElement => {
    return elementsToRemove.findIndex( elementToRemove =>
      elementToRemove[elementKey as keyof ElementType] === targetElement[elementKey as keyof ElementType]) > 0;
  });
}