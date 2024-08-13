import * as xlsx from "xlsx";
import {
  DYNAMIC_CALL_FLOW_PATH,
  getXlsImporterResults
} from "dynamicCallFlowCommon/Xlsx/test/Xlsx.Testing.Util";
import { PhoneNumberXlsxImporter } from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Importer";

function getPhoneNumberXlsxImporterResults(fileName: string): xlsx.WorkSheet {
  return getXlsImporterResults(new PhoneNumberXlsxImporter(), fileName);
}

const DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH = DYNAMIC_CALL_FLOW_PATH.concat("phoneNumber/Xlsx/Import/test/");

describe("Phone Number XLSX Importer", () => {
  test("dynamic happy path", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH.concat("dynamic-safeco.xlsx"));

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(168);
    expect(xlsxImporterResults.errors.length).toBe(0);
  });

  test("legacy happy path", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH.concat("Legacy-Comparion.xlsx"));

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(98);
    expect(xlsxImporterResults.errors.length).toBe(0);
  });

  test("empty import", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH.concat("empty.xlsx"));

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(0);
    expect(xlsxImporterResults.errors.length).toBe(1);
    expect(xlsxImporterResults.errors[0]).toStrictEqual("The file is empty.");
  });

  test("max row import reached", () => {
    const xlsxImporterResults = getPhoneNumberXlsxImporterResults(
      DYNAMIC_CALL_FLOW_PHONE_NUMBER_XLSX_TEST_PATH.concat("over_max_rows.xlsx"));

    expect(xlsxImporterResults).toBeDefined();
    expect(xlsxImporterResults.records.length).toBe(0);
    expect(xlsxImporterResults.errors.length).toBe(1);
    expect(xlsxImporterResults.errors[0]).toStrictEqual("The maximum number of phone numbers that can be imported at one time is 500.");
  });
});