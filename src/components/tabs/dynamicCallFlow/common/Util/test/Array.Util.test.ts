import {
  addElementToArray,
  addElementsToArray,
  updateElementInArray,
  updateElementsInArray,
  removeElementFromArray,
  removeElementsFromArray,
  elementExistsInArray,
  findMatchingElements,
  elementDoesNotExistInArray,
  stringToArray,
  isNotArray,
  isArray,
  elementsMatch,
  matchFound,
  elementsDoNotMatch, MatchFilter
} from "../Array.Util";

interface TestElement {
  id: number;
  value: string;
}

const elementOne: TestElement = {
  id: 1,
  value: "value1"
};

const elementOneNew: TestElement = {
  id: 1,
  value: "newValue"
};

const elementOneOld: TestElement = {
  id: 1,
  value: "oldValue"
};

const elementTwo: TestElement = {
  id: 2,
  value: "value2"
};

const elementThree: TestElement = {
  id: 3,
  value: "value3"
};

const elementThreeNew: TestElement = {
  id: 3,
  value: "newValue3"
};

const elementThreeOld: TestElement = {
  id: 3,
  value: "oldValue3"
};

const TEST_ELEMENT_ID = "id";

const testElementMatchFilter: MatchFilter<TestElement> = (testElement1: TestElement, testElement2: TestElement): boolean => {
  return testElement1 && testElement2
    && testElement1[TEST_ELEMENT_ID] === testElement2[TEST_ELEMENT_ID];
};

describe("Array Util", () => {

  describe("stringToArray", () => {
    it("shouldConvertCommaSeparatedStringToArray", () => {
      const result = stringToArray("a,b,c");
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("shouldReturnEmptyArrayForEmptyString", () => {
      const result = stringToArray("");
      expect(result).toEqual([]);
    });

    it("shouldReturnEmptyArrayForNonStringInput", () => {
      const result = stringToArray(null);
      expect(result).toEqual([]);
      const result2 = stringToArray(undefined);
      expect(result2).toEqual([]);
    });
  });

  describe("addElementToArray", () => {
    it("shouldAddElementToEndOfArray", () => {
      const result = addElementToArray("newElement", ["element1", "element2"]);
      expect(result).toEqual(["element1", "element2", "newElement"]);
    });

    it("shouldAddElementToEmptyArray", () => {
      const result = addElementToArray("newElement", []);
      expect(result).toEqual(["newElement"]);
    });

    it("shouldAddElementToArrayWithDifferentTypes", () => {
      const result = addElementToArray(3, [1, 2]);
      expect(result).toEqual([1, 2, 3]);
    });

    it("shouldReturnNewArrayInstance", () => {
      const originalArray = ["element1", "element2"];
      const result = addElementToArray("newElement", originalArray);
      expect(result).not.toBe(originalArray);
    });

    it("shouldHandleNullElement", () => {
      const result = addElementToArray(null, ["element1", "element2"]);
      expect(result).toEqual(["element1", "element2", null]);
    });

    it("shouldHandleUndefinedElement", () => {
      const result = addElementToArray(undefined, ["element1", "element2"]);
      expect(result).toEqual(["element1", "element2", undefined]);
    });

    it("shouldHandleNullArray", () => {
      const result = addElementToArray("newElement", null);
      expect(result).toEqual(["newElement"]);
    });

    it("shouldHandleUndefinedArray", () => {
      const result = addElementToArray("newElement", undefined);
      expect(result).toEqual(["newElement"]);
    });
  });

  describe("addElementsToArray", () => {
    it("shouldAddMultipleElementsToEndOfArray", () => {
      const result = addElementsToArray(["newElement1", "newElement2"], ["element1", "element2"]);
      expect(result).toEqual(["element1", "element2", "newElement1", "newElement2"]);
    });

    it("shouldAddElementsToEmptyArray", () => {
      const result = addElementsToArray(["newElement1", "newElement2"], []);
      expect(result).toEqual(["newElement1", "newElement2"]);
    });

    it("shouldAddEmptyArrayToArray", () => {
      const result = addElementsToArray([], ["element1", "element2"]);
      expect(result).toEqual(["element1", "element2"]);
    });

    it("shouldAddElementsToArrayWithDifferentTypes", () => {
      const result = addElementsToArray([3, 4], [1, 2]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("shouldReturnNewArrayInstance", () => {
      const originalArray = ["element1", "element2"];
      const result = addElementsToArray(["newElement1", "newElement2"], originalArray);
      expect(result).not.toBe(originalArray);
    });

    it("shouldHandleNullElementsArray", () => {
      const result = addElementsToArray(null, ["element1", "element2"]);
      expect(result).toEqual(["element1", "element2"]);
    });

    it("shouldHandleUndefinedElementsArray", () => {
      const result = addElementsToArray(undefined, ["element1", "element2"]);
      expect(result).toEqual(["element1", "element2"]);
    });

    it("shouldHandleNullTargetArray", () => {
      const result = addElementsToArray(["newElement1", "newElement2"], null);
      expect(result).toEqual(["newElement1", "newElement2"]);
    });

    it("shouldHandleUndefinedTargetArray", () => {
      const result = addElementsToArray(["newElement1", "newElement2"], undefined);
      expect(result).toEqual(["newElement1", "newElement2"]);
    });
  });

  describe("updateElementInArray", () => {
    it("shouldUpdateElementWhenKeyMatches", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElement = {
        id: 1,
        value: "newValue"
      };
      const result = updateElementInArray(testElementMatchFilter, updatedElement, targetArray);
      expect(result).toEqual([{
        id: 1,
        value: "newValue"
      }, {
        id: 2,
        value: "value2"
      }]);
    });

    it("shouldNotUpdateElementWhenKeyDoesNotMatch", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElement = {
        id: 3,
        value: "newValue"
      };
      const result = updateElementInArray(testElementMatchFilter, updatedElement, targetArray);
      expect(result).toEqual([{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }]);
    });

    it("shouldReturnEmptyArrayWhenTargetArrayIsEmpty", () => {
      const targetArray: any[] = [];
      const updatedElement = {
        id: 1,
        value: "newValue"
      };
      const result = updateElementInArray(testElementMatchFilter, updatedElement, targetArray);
      expect(result).toEqual([]);
    });

    it("shouldReturnNullWhenTargetArrayIsNull", () => {
      const targetArray: any = null;
      const updatedElement = {
        id: 1,
        value: "newValue"
      };
      const result = updateElementInArray(testElementMatchFilter, updatedElement, targetArray);
      expect(result).toEqual([updatedElement]);
    });

    it("shouldReturnUndefinedWhenTargetArrayIsUndefined", () => {
      const targetArray: any = undefined;
      const updatedElement = {
        id: 1,
        value: "newValue"
      };
      const result = updateElementInArray(testElementMatchFilter, updatedElement, targetArray);
      expect(result).toEqual([updatedElement]);
    });

    it("shouldHandleNullUpdatedElement", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElement: any = null;
      const result = updateElementInArray(testElementMatchFilter, updatedElement, targetArray);
      expect(result).toEqual(targetArray);
    });

    it("shouldHandleUndefinedUpdatedElement", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElement: any = undefined;
      const result = updateElementInArray(testElementMatchFilter, updatedElement, targetArray);
      expect(result).toEqual(targetArray);
    });
  });

  describe("updateElementsInArray", () => {
    it("shouldUpdateElementsWhenKeysMatch", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElements = [{
        id: 1,
        value: "newValue"
      }];
      const result = updateElementsInArray(testElementMatchFilter, updatedElements, targetArray);
      expect(result).toEqual([{
        id: 1,
        value: "newValue"
      }, {
        id: 2,
        value: "value2"
      }]);
    });

    it("shouldNotUpdateElementsWhenKeysDoNotMatch", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElements = [{
        id: 3,
        value: "newValue"
      }];
      const result = updateElementsInArray(testElementMatchFilter, updatedElements, targetArray);
      expect(result).toEqual([{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }]);
    });

    it("shouldReturnEmptyArrayWhenTargetArrayIsEmpty", () => {
      const targetArray: any[] = [];
      const updatedElements = [{
        id: 1,
        value: "newValue"
      }];
      const result = updateElementsInArray(testElementMatchFilter, updatedElements, targetArray);
      expect(result).toEqual([]);
    });

    it("shouldReturnNullWhenTargetArrayIsNull", () => {
      const targetArray: any = null;
      const updatedElements = [{
        id: 1,
        value: "newValue"
      }];
      const result = updateElementsInArray(testElementMatchFilter, updatedElements, targetArray);
      expect(result).toEqual(updatedElements);
    });

    it("shouldReturnUndefinedWhenTargetArrayIsUndefined", () => {
      const targetArray: any = undefined;
      const updatedElements = [{
        id: 1,
        value: "newValue"
      }];
      const result = updateElementsInArray(testElementMatchFilter, updatedElements, targetArray);
      expect(result).toEqual(updatedElements);
    });

    it("shouldHandleNullUpdatedElementsArray", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElements: any = null;
      const result = updateElementsInArray(testElementMatchFilter, updatedElements, targetArray);
      expect(result).toEqual(targetArray);
    });

    it("shouldHandleUndefinedUpdatedElementsArray", () => {
      const targetArray = [{
        id: 1,
        value: "oldValue"
      }, {
        id: 2,
        value: "value2"
      }];
      const updatedElements: any = undefined;
      const result = updateElementsInArray(testElementMatchFilter, updatedElements, targetArray);
      expect(result).toEqual(targetArray);
    });
  });

  describe("removeElementFromArray", () => {
    it("shouldRemoveElementWhenKeyMatches", () => {
      const result = removeElementFromArray(testElementMatchFilter, elementOne, [elementOne, elementTwo]);
      expect(result).toEqual([elementTwo]);
    });

    it("shouldNotRemoveElementWhenKeyDoesNotMatch", () => {
      const result = removeElementFromArray(testElementMatchFilter, elementThree, [elementOne, elementTwo]);
      expect(result).toEqual([elementOne, elementTwo]);
    });

    it("shouldReturnEmptyArrayWhenTargetArrayIsEmpty", () => {
      const result = removeElementFromArray(testElementMatchFilter, elementOne, []);
      expect(result).toEqual([]);
    });

    it("shouldReturnNullWhenTargetArrayIsNull", () => {
      const result = removeElementFromArray(testElementMatchFilter, elementOne, null);
      expect(result).toEqual([]);
    });

    it("shouldReturnUndefinedWhenTargetArrayIsUndefined", () => {
      const result = removeElementFromArray(testElementMatchFilter, elementOne, undefined);
      expect(result).toEqual([]);
    });

    it("shouldHandleNullElementToRemove", () => {
      const result = removeElementFromArray(testElementMatchFilter, null, [elementOne, elementTwo]);
      expect(result).toEqual([elementOne, elementTwo]);
    });

    it("shouldHandleUndefinedElementToRemove", () => {
      const result = removeElementFromArray(testElementMatchFilter, undefined, [elementOne, elementTwo]);
      expect(result).toEqual([elementOne, elementTwo]);
    });
  });

  describe("removeElementsFromArray", () => {
    it("shouldRemoveElementsWhenKeysMatch", () => {
      const result = removeElementsFromArray(testElementMatchFilter, [elementOne, elementThree], [elementOne, elementTwo, elementThree]);
      expect(result).toEqual([elementTwo]);
    });

    it("shouldNotRemoveElementsWhenKeysDoNotMatch", () => {
      const result = removeElementsFromArray(testElementMatchFilter, [elementThree], [elementOne, elementTwo]);
      expect(result).toEqual([elementOne, elementTwo]);
    });

    it("shouldReturnEmptyArrayWhenTargetArrayIsEmpty", () => {
      const result = removeElementsFromArray(testElementMatchFilter, [elementOne], []);
      expect(result).toEqual([]);
    });

    it("shouldReturnNullWhenTargetArrayIsNull", () => {
      const result = removeElementsFromArray(testElementMatchFilter, [elementOne], null);
      expect(result).toEqual([]);
    });

    it("shouldReturnUndefinedWhenTargetArrayIsUndefined", () => {
      const result = removeElementsFromArray(testElementMatchFilter, [elementOne], undefined);
      expect(result).toEqual([]);
    });

    it("shouldHandleNullElementsToRemove", () => {
      const result = removeElementsFromArray(testElementMatchFilter, null, [elementOne, elementTwo]);
      expect(result).toEqual([elementOne, elementTwo]);
    });

    it("shouldHandleUndefinedElementsToRemove", () => {
      const result = removeElementsFromArray(testElementMatchFilter, undefined, [elementOne, elementTwo]);
      expect(result).toEqual([elementOne, elementTwo]);
    });
  });

  describe("elementExistsInArray", () => {
    it("shouldReturnTrueWhenElementExistsInArray", () => {
      const result = elementExistsInArray(testElementMatchFilter, elementOne, [elementOne, elementTwo]);
      expect(result).toBe(true);
    });

    it("shouldReturnFalseWhenElementDoesNotExistInArray", () => {
      const result = elementExistsInArray(testElementMatchFilter, elementThree, [elementOne, elementTwo]);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenArrayIsEmpty", () => {
      const result = elementExistsInArray(testElementMatchFilter, elementOne, []);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenArrayIsNull", () => {
      const result = elementExistsInArray(testElementMatchFilter, elementOne, null);
      expect(result).toBe(false);
    });

    it("shouldReturnFalseWhenArrayIsUndefined", () => {
      const result = elementExistsInArray(testElementMatchFilter, elementOne, undefined);
      expect(result).toBe(false);
    });

    it("shouldHandleNullElementToCheck", () => {
      const result = elementExistsInArray(testElementMatchFilter, null, [elementOne, elementTwo]);
      expect(result).toBe(false);
    });

    it("shouldHandleUndefinedElementToCheck", () => {
      const result = elementExistsInArray(testElementMatchFilter, undefined, [elementOne, elementTwo]);
      expect(result).toBe(false);
    });
  });

  describe("elementDoesNotExistInArray", () => {
    it("shouldReturnTrueWhenElementDoesNotExistInArray", () => {
      const result = elementDoesNotExistInArray(testElementMatchFilter, elementThree, [elementOne, elementTwo]);
      expect(result).toBe(true);
    });

    it("shouldReturnFalseWhenElementExistsInArray", () => {
      const result = elementDoesNotExistInArray(testElementMatchFilter, elementOne, [elementOne, elementTwo]);
      expect(result).toBe(false);
    });

    it("shouldReturnTrueWhenArrayIsEmpty", () => {
      const result = elementDoesNotExistInArray(testElementMatchFilter, elementOne, []);
      expect(result).toBe(true);
    });

    it("shouldReturnTrueWhenArrayIsNull", () => {
      const result = elementDoesNotExistInArray(testElementMatchFilter, elementOne, null);
      expect(result).toBe(true);
    });

    it("shouldReturnTrueWhenArrayIsUndefined", () => {
      const result = elementDoesNotExistInArray(testElementMatchFilter, elementOne, undefined);
      expect(result).toBe(true);
    });

    it("shouldHandleNullElementToCheck", () => {
      const result = elementDoesNotExistInArray(testElementMatchFilter, null, [elementOne, elementTwo]);
      expect(result).toBe(true);
    });

    it("shouldHandleUndefinedElementToCheck", () => {
      const result = elementDoesNotExistInArray(testElementMatchFilter, undefined, [elementOne, elementTwo]);
      expect(result).toBe(true);
    });
  });

  describe("elementsMatch", () => {
    it("shouldReturnTrueWhenElementsMatchByKey", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      const elementTwo = {
        id: 1,
        value: "value2"
      };
      expect(elementsMatch(testElementMatchFilter, elementOne, elementTwo)).toBe(true);
    });

    it("shouldReturnFalseWhenElementsDoNotMatchByKey", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      const elementTwo = {
        id: 2,
        value: "value2"
      };
      expect(elementsMatch(testElementMatchFilter, elementOne, elementTwo)).toBe(false);
    });

    it("shouldReturnFalseWhenElementsAreNull", () => {
      expect(elementsMatch(testElementMatchFilter, null, null)).toBe(false);
    });

    it("shouldReturnFalseWhenOneElementIsNull", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      expect(elementsMatch(testElementMatchFilter, elementOne, null)).toBe(false);
    });

    it("shouldReturnFalseWhenElementsAreUndefined", () => {
      expect(elementsMatch(testElementMatchFilter, undefined, undefined)).toBe(false);
    });

    it("shouldReturnFalseWhenOneElementIsUndefined", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      expect(elementsMatch(testElementMatchFilter, elementOne, undefined)).toBe(false);
    });
  });

  describe("elementsDoNotMatch", () => {
    it("shouldReturnTrueWhenElementsDoNotMatchByKey", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      const elementTwo = {
        id: 2,
        value: "value2"
      };
      expect(elementsDoNotMatch(testElementMatchFilter, elementOne, elementTwo)).toBe(true);
    });

    it("shouldReturnFalseWhenElementsMatchByKey", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      const elementTwo = {
        id: 1,
        value: "value2"
      };
      expect(elementsDoNotMatch(testElementMatchFilter, elementOne, elementTwo)).toBe(false);
    });

    it("shouldReturnTrueWhenElementsAreNull", () => {
      expect(elementsDoNotMatch(testElementMatchFilter, null, null)).toBe(true);
    });

    it("shouldReturnTrueWhenOneElementIsNull", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      expect(elementsDoNotMatch(testElementMatchFilter, elementOne, null)).toBe(true);
    });

    it("shouldReturnTrueWhenElementsAreUndefined", () => {
      expect(elementsDoNotMatch(testElementMatchFilter, undefined, undefined)).toBe(true);
    });

    it("shouldReturnTrueWhenOneElementIsUndefined", () => {
      const elementOne = {
        id: 1,
        value: "value1"
      };
      expect(elementsDoNotMatch(testElementMatchFilter, elementOne, undefined)).toBe(true);
    });
  });

  describe("findMatchingElements", () => {
    const matchFilter = (record1: { id: number }, record2: { id: number }) => record1.id === record2.id;

    it("shouldReturnMatchingElementsWhenMatchesFound", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementsToMatch = [{ id: 2 }, { id: 3 }];
      const result = findMatchingElements(listToSearchIn, elementsToMatch, matchFilter);
      expect(result).toEqual([{ id: 2 }, { id: 3 }]);
    });

    it("shouldReturnEmptyArrayWhenNoMatchesFound", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementsToMatch = [{ id: 4 }];
      const result = findMatchingElements(listToSearchIn, elementsToMatch, matchFilter);
      expect(result).toEqual([]);
    });

    it("shouldReturnEmptyArrayWhenElementsToMatchIsEmpty", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementsToMatch: { id: number }[] = [];
      const result = findMatchingElements(listToSearchIn, elementsToMatch, matchFilter);
      expect(result).toEqual([]);
    });

    it("shouldReturnEmptyArrayWhenListToSearchInIsEmpty", () => {
      const listToSearchIn: { id: number }[] = [];
      const elementsToMatch = [{ id: 1 }];
      const result = findMatchingElements(listToSearchIn, elementsToMatch, matchFilter);
      expect(result).toEqual([]);
    });

    it("shouldReturnEmptyArrayWhenElementsToMatchIsNull", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementsToMatch: any = null;
      const result = findMatchingElements(listToSearchIn, elementsToMatch, matchFilter);
      expect(result).toEqual([]);
    });

    it("shouldReturnEmptyArrayWhenListToSearchInIsNull", () => {
      const listToSearchIn: any = null;
      const elementsToMatch = [{ id: 1 }];
      const result = findMatchingElements(listToSearchIn, elementsToMatch, matchFilter);
      expect(result).toEqual([]);
    });

    it("shouldReturnEmptyArrayWhenMatchFilterIsNull", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementsToMatch = [{ id: 1 }];
      const matchFilter: any = null;
      const result = findMatchingElements(listToSearchIn, elementsToMatch, matchFilter);
      expect(result).toEqual([]);
    });
  });

  describe("matchFound", () => {
    const matchFilter = (record1: { id: number }, record2: { id: number }) => record1.id === record2.id;

    it("shouldReturnTrueWhenMatchingElementFound", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementToMatch = { id: 2 };
      expect(matchFound(listToSearchIn, elementToMatch, matchFilter)).toBe(true);
    });

    it("shouldReturnFalseWhenNoMatchingElementFound", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementToMatch = { id: 4 };
      expect(matchFound(listToSearchIn, elementToMatch, matchFilter)).toBe(false);
    });

    it("shouldReturnFalseWhenListToSearchInIsEmpty", () => {
      const listToSearchIn: { id: number }[] = [];
      const elementToMatch = { id: 1 };
      expect(matchFound(listToSearchIn, elementToMatch, matchFilter)).toBe(false);
    });

    it("shouldReturnFalseWhenElementToMatchIsNull", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementToMatch: any = null;
      expect(matchFound(listToSearchIn, elementToMatch, matchFilter)).toBe(false);
    });

    it("shouldReturnFalseWhenListToSearchInIsNull", () => {
      const listToSearchIn: any = null;
      const elementToMatch = { id: 1 };
      expect(matchFound(listToSearchIn, elementToMatch, matchFilter)).toBe(false);
    });

    it("shouldReturnFalseWhenMatchFilterIsNull", () => {
      const listToSearchIn = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const elementToMatch = { id: 1 };
      const matchFilter: any = null;
      expect(matchFound(listToSearchIn, elementToMatch, matchFilter)).toBe(false);
    });
  });

  describe("isArray", () => {
    it("shouldReturnTrueForArray", () => {
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it("shouldReturnFalseForNonArray", () => {
      expect(isArray("not an array")).toBe(false);
    });

    it("shouldReturnFalseForNull", () => {
      expect(isArray(null)).toBe(false);
    });

    it("shouldReturnFalseForUndefined", () => {
      expect(isArray(undefined)).toBe(false);
    });

    it("shouldReturnFalseForObject", () => {
      expect(isArray({ key: "value" })).toBe(false);
    });
  });

  describe("isNotArray", () => {
    it("shouldReturnFalseForArray", () => {
      expect(isNotArray([1, 2, 3])).toBe(false);
    });

    it("shouldReturnTrueForNonArray", () => {
      expect(isNotArray("not an array")).toBe(true);
    });

    it("shouldReturnTrueForNull", () => {
      expect(isNotArray(null)).toBe(true);
    });

    it("shouldReturnTrueForUndefined", () => {
      expect(isNotArray(undefined)).toBe(true);
    });

    it("shouldReturnTrueForObject", () => {
      expect(isNotArray({ key: "value" })).toBe(true);
    });
  });
});