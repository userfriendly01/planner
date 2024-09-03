import { PhoneNumberXlsxExporter } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Export/PhoneNumber.Xlsx.Exporter";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";

describe("PhoneNumberXlsxExporter", () => {
  let exporter: PhoneNumberXlsxExporter;
  let dynamicRecord: PhoneNumberRecordType;
  let legacyRecord: PhoneNumberRecordType;

  beforeEach(() => {
    exporter = PhoneNumberXlsxExporter.instance();
    dynamicRecord = { /* mock dynamic record */ } as PhoneNumberRecordType;
    legacyRecord = { /* mock legacy record */ } as PhoneNumberRecordType;
  });

  it("should convert dynamic records to XLSX rows", () => {
    jest.spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").mockReturnValue(true);
    const records = [dynamicRecord];
    const result = exporter.convertRecordsToXlsxRows(records);
    expect(result).toEqual(expect.any(Array));
  });

  it("should convert legacy records to XLSX rows", () => {
    jest.spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").mockReturnValue(false);
    const records = [legacyRecord];
    const result = exporter.convertRecordsToXlsxRows(records);
    expect(result).toEqual(expect.any(Array));
  });

  it("should group records by workbook names correctly", () => {
    jest.spyOn(PhoneNumberRecordUtil, "isDynamicPhoneNumberRecord").mockImplementation(record => record === dynamicRecord);
    const records = [dynamicRecord, legacyRecord];
    const result = exporter.groupRecordsByWorkBookNames(records);
    expect(result.get("Dynamic Phone Numbers")).toContain(dynamicRecord);
    expect(result.get("Legacy Phone Numbers")).toContain(legacyRecord);
  });

  it("should handle empty records array", () => {
    const records: PhoneNumberRecordType[] = [];
    const result = exporter.convertRecordsToXlsxRows(records);
    expect(result).toEqual([]);
  });

  it("should handle empty records array in grouping", () => {
    const records: PhoneNumberRecordType[] = [];
    const result = exporter.groupRecordsByWorkBookNames(records);
    expect(result.get("Dynamic Phone Numbers")).toEqual([]);
    expect(result.get("Legacy Phone Numbers")).toEqual([]);
  });
});