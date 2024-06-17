import * as xlsx from "xlsx";
import { PhoneNumberXlsxReader } from "../PhoneNumber.Xlsx.Reader";
import { getXlsReaderResults } from "../../../common/Xlsx/test/Xlsx.Testing.Util";

function getPhoneNumberXlsxReaderResults(fileName: string): xlsx.WorkSheet {
  return getXlsReaderResults(new PhoneNumberXlsxReader(), fileName);
}

describe("Action XLSX Reader", () => {
  test("dynamic happy path", () => {
    const xlsxReaderResults = getPhoneNumberXlsxReaderResults(
      "./src/components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/dynamic-safeco.xlsx");

    expect(xlsxReaderResults).toBeDefined();
    expect(xlsxReaderResults.records.length).toBe(211);
    expect(xlsxReaderResults.errors.length).toBe(0);
  });

  test("legacy happy path", () => {
    const xlsxReaderResults = getPhoneNumberXlsxReaderResults(
      "./src/components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/dynamic-safeco.xlsx");

    expect(xlsxReaderResults).toBeDefined();
    expect(xlsxReaderResults.records.length).toBe(98);
    expect(xlsxReaderResults.errors.length).toBe(0);
  });
});