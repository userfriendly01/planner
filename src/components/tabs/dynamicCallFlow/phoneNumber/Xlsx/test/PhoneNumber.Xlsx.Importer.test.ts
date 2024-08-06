import * as xlsx from "xlsx";
import {
  DYNAMIC_CALL_FLOW_PATH,
  getXlsImporterResults
} from "components/tabs/dynamicCallFlow/common/Xlsx/test/Xlsx.Testing.Util";
import { PhoneNumberXlsxImporter } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Importer";

function getPhoneNumberXlsxImporterResults(fileName: string): xlsx.WorkSheet {
  return getXlsImporterResults(new PhoneNumberXlsxImporter(), fileName);
}

const DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH = DYNAMIC_CALL_FLOW_PATH.concat("/phoneNumber/Xlsx/test/");
describe("Phone Number XLSX Importer", () => {
  test("dynamic happy path", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH.concat("dynamic-safeco.xlsx"));

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(211);
    expect(xlsxImporterResults.errors.length).toBe(0);
  });

  test("legacy happy path", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH.concat("Legacy-Comparion.xlsx"));

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(98);
    expect(xlsxImporterResults.errors.length).toBe(0);
  });
});