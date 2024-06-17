import * as xlsx from "xlsx";
import { ActionXlsxReader } from "../Action.Xlsx.Reader";
import { getXlsReaderResults } from "../../../common/Xlsx/test/Xlsx.Testing.Util";

function getActionXlsxReaderResults(fileName: string): xlsx.WorkSheet {
  return getXlsReaderResults(new ActionXlsxReader(), fileName);
}

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
  test("temp", () => {
    const newCallFlowConfigRecords = [ { id: 1 } ];
    const oldCallFlowConfigRecords = [ { id: 1 }, { id: 2 }, { id: 3 } ];
    // const oldCallFlowConfigRecordsToDelete =
    //   oldCallFlowConfigRecords.filter(oldCallFlowConfigRecord =>
    //     !newCallFlowConfigRecords.find(newCallFlowConfigRecord => oldCallFlowConfigRecord.id === newCallFlowConfigRecord.id));
    const oldCallFlowConfigRecordsToDelete =
      oldCallFlowConfigRecords.filter(oldCallFlowConfigRecord => !newCallFlowConfigRecords.find(newCallFlowConfigRecord => oldCallFlowConfigRecord.id === newCallFlowConfigRecord.id));
    expect(oldCallFlowConfigRecordsToDelete.length).toBe(2);
  });
});