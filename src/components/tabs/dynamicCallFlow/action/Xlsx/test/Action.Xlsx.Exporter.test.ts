import { getActionXlsxImporterResults } from "dynamicCallFlow/Xlsx/test/Action.Xlsx.Test.Util";

jest.mock("uuid", () => jest.requireActual("uuid"));

describe("Action XLSX Exporter", () => {
  test("happy path", () => {
    const xlsxImporterResults = getActionXlsxImporterResults("AISGMain.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.errors.length).toBe(0);
  });
});