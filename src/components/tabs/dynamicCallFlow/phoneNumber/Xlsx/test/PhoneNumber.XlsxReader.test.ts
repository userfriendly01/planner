import * as xlsx from "xlsx";
import { PhoneNumberXlsxReader } from "../PhoneNumber.Xlsx.Reader";

describe("Action XLSX Reader", () => {
  test("dynamic happy path", () => {
    const workBook = xlsx.readFile("./src/components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/dynamic-safeco.xlsx");
    expect(workBook).toBeDefined();

    const phoneNumberXlsxReader = new PhoneNumberXlsxReader();

    const xlsReaderResults = phoneNumberXlsxReader.processWorkBook(workBook);

    expect(xlsReaderResults).toBeDefined();
    expect(xlsReaderResults.records.length).toBe(211);
    expect(xlsReaderResults.errors.length).toBe(0);
  });

  test("legacy happy path", () => {
    const workBook = xlsx.readFile("./src/components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/Legacy-Comparion.xlsx");
    expect(workBook).toBeDefined();

    const phoneNumberXlsxReader = new PhoneNumberXlsxReader();

    const xlsReaderResults = phoneNumberXlsxReader.processWorkBook(workBook);

    expect(xlsReaderResults).toBeDefined();
    expect(xlsReaderResults.records.length).toBe(98);
    expect(xlsReaderResults.errors.length).toBe(0);
  });
});