import { getActionXlsxImporterResults } from "components/tabs/dynamicCallFlow/action/Xlsx/test/Action.Xlsx.Test.Util";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "00000000-0000-0000-0000-000000000000"),
  validate: jest.fn(() => true)
}));

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

  test("capture action", () => {
    const xlsxImporterResults = getActionXlsxImporterResults("CaptureTest.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.errors.length).toBe(0);
  });
});