import {
  addElementToArray,
  addElementsToArray,
  updateElementInArray,
  updateElementsInArray,
  removeElementFromArray,
  removeElementsFromArray,
  elementExistsInArray,
  findMatchingElements, elementDoesNotExistInArray
} from "../Array.Util";

const elementOne = {
  id: 1,
  value: "value1"
};

const elementOneNew = {
  id: 1,
  value: "newValue"
};

const elementOneOld = {
  id: 1,
  value: "oldValue"
};

const elementTwo = {
  id: 2,
  value: "value2"
};

const elementThree = {
  id: 3,
  value: "value3"
};

const elementThreeNew = {
  id: 3,
  value: "newValue3"
};

const elementThreeOld = {
  id: 3,
  value: "oldValue3"
};

describe("Array Util", () => {
  it("shouldAddElementToArray", () => {
    const result = addElementToArray("newElement", ["element1", "element2"]);
    expect(result).toEqual(["element1", "element2", "newElement"]);
  });

  it("shouldAddElementsToArray", () => {
    const result = addElementsToArray(["newElement1", "newElement2"], ["element1", "element2"]);
    expect(result).toEqual(["element1", "element2", "newElement1", "newElement2"]);
  });

  it("shouldUpdateElementInArray", () => {
    const result = updateElementInArray("id", elementOneNew, [elementOneOld, elementTwo]);
    expect(result).toEqual([elementOneNew, elementTwo]);
  });

  it("shouldUpdateElementsInArray", () => {
    const result = updateElementsInArray("id", [elementOneNew, elementThreeNew], [elementOneOld, elementTwo, elementThreeOld]);
    expect(result).toEqual([elementOneNew, elementTwo, elementThreeNew]);
  });

  it("shouldRemoveElementFromArray", () => {
    const result = removeElementFromArray("id", elementOne, [elementOne, elementTwo]);
    expect(result).toEqual([elementTwo]);
  });

  it("shouldRemoveElementsFromArray", () => {
    const result = removeElementsFromArray("id", [elementOne, elementThree], [elementOne, elementTwo, elementThree]);
    expect(result).toEqual([elementTwo]);
  });

  it("shouldCheckElementExistsInArray", () => {
    const result = elementExistsInArray("id", elementOne, [elementOne, elementTwo]);
    expect(result).toBe(true);
  });

  it("shouldCheckElementExistsInArrayFalse", () => {
    const result = elementExistsInArray("id", elementThree, [elementOne, elementTwo]);
    expect(result).toBe(false);
  });

  it("shouldCheckElementDoesNotExistInArray", () => {
    const result = elementDoesNotExistInArray("id", elementThree, [elementOne, elementTwo]);
    expect(result).toBe(true);
  });

  it("shouldFindMatchingElements", () => {
    const result = findMatchingElements([elementOne, elementTwo, elementThree], [elementOne, elementThree], (record1, record2) => record1.id === record2.id);
    expect(result).toEqual([elementOne, elementThree]);
  });
});