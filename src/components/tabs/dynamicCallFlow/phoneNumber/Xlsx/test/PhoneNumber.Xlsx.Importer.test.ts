import * as xlsx from "xlsx";
import { PhoneNumberXlsxImporter } from "../PhoneNumber.Xlsx.Importer";
import { getXlsImporterResults } from "../../../common/Xlsx/test/Xlsx.Testing.Util";

function getPhoneNumberXlsxImporterResults(fileName: string): xlsx.WorkSheet {
  return getXlsImporterResults(new PhoneNumberXlsxImporter(), fileName);
}

describe("Action XLSX Importer", () => {
  test("dynamic happy path", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      "./src/components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/dynamic-safeco.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(211);
    expect(xlsxImporterResults.errors.length).toBe(0);
  });

  test("legacy happy path", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      "./src/components/tabs/dynamicCallFlow/phoneNumber/Xlsx/test/dynamic-safeco.xlsx");

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(98);
    expect(xlsxImporterResults.errors.length).toBe(0);
  });
});