import { getActionXlsxReaderResults } from "../../../common/Xlsx/test/Xlsx.Testing.Util";

describe("Action XLSX Reader", () => {
  test("happy path", () => {
    const xlsxReaderResults = getActionXlsxReaderResults(
      "./src/components/tabs/dynamicCallFlow/action/Xlsx/test/AISGMain.xlsx");

    expect(xlsxReaderResults).toBeDefined();
    expect(xlsxReaderResults.errors.length).toBe(0);
  });

  test("invalid REDIRECT url", () => {
    const xlsxReaderResults = getActionXlsxReaderResults(
      "./src/components/tabs/dynamicCallFlow/action/Xlsx/test/AISGMain-redirect-url-invalid.xlsx");

    expect(xlsxReaderResults).toBeDefined();
    expect(xlsxReaderResults.errors.length).toBe(2);
  });

  // test("temp", () => {
  //   const oldArray = [ { id: 1, name: "one"}, {id: 2, name: "two"}, {id: 3, name: "three"} ];
  //   const newArray = [ { id: 2, name: "two"} ];
  //
  //   const result = removeElementsFromArray("id", newArray, oldArray);
  //   expect(result.length).toBe(2);
  // });
});

function elementExistsInArray(element: any, array: any[]): boolean {
  return array.some((arrayElement) => arrayElement.id === element.id);
}

function elementDoesNotExistInArray(element: any, array: any[]): boolean {
  return !elementExistsInArray(element, array);
}