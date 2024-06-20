import { getActionXlsxImporterResults } from "dynamicCallFlow/Xlsx/test/Action.Xlsx.Test.Util";

describe("Action XLSX Importer", () => {
  test("happy path", () => {
    const xlsxImporterResults = getActionXlsxImporterResults("AISGMain.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.errors.length).toBe(0);
  });

  test("invalid REDIRECT url", () => {
    const xlsxImporterResults = getActionXlsxImporterResults("AISGMain-redirect-url-invalid.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.errors.length).toBe(2);
  });

  // test("temp", () => {
  //   const oldArray = [ { id: 1, name: "one"}, {id: 2, name: "two"}, {id: 3, name: "three"} ];
  //   const newArray = [ { id: 2, name: "two"} ];
  //
  //   const result = removeElementsFromArray("id", newArray, oldArray);
  //   expect(result.length).toBe(2);
  // });
});