import { getActionXlsxImporterResults } from "dynamicCallFlowAction/Xlsx/test/Action.Xlsx.Test.Util";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "00000000-0000-0000-0000-000000000000"),
  validate: jest.fn(() => true)
}));

describe("Action XLSX Exporter", () => {
  test("happy path", () => {
    const xlsxImporterResults = getActionXlsxImporterResults("AISGMain.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.errors.length).toBe(0);
  });
});