import { getActionXlsxReaderResults } from "components/tabs/dynamicCallFlow/common/Xlsx/test/Xlsx.Testing.Util";

describe("Action XLSX Exporter", () => {
  test("happy path", () => {
    const xlsxReaderResults = getActionXlsxReaderResults(
      "./src/components/tabs/dynamicCallFlow/action/Xlsx/test/AISGMain.xlsx");

    expect(xlsxReaderResults).toBeDefined();
    expect(xlsxReaderResults.errors.length).toBe(0);
  });
});