import {
  hasDuplicatePhoneNumberRecord, checkForDuplicatePhoneNumberRecord, hasDuplicatePhoneNumberRecords, generateMatchingRecordMessages, findMatchingPhoneNumberRecords, pkeyFilter, pkeyAndEmployeeIdFilter, dynamicAndLegacyPhoneNumberRecordFilter
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Match.PhoneNumber.Records.Util";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

describe("MatchPhoneNumberRecordsUtil", () => {
  let mockPhoneNumberRecords: PhoneNumberRecordType[];
  let mockPhoneNumberRecord: PhoneNumberRecordType;

  beforeEach(() => {
    mockPhoneNumberRecords = [
      {
        pkey: "123",
        employeeId: "n001"
      },
      {
        pkey: "456",
        employeeId: "n002"
      }
    ] as PhoneNumberRecordType[];
    mockPhoneNumberRecord = {
      pkey: "123",
      employeeId: "n001"
    } as PhoneNumberRecordType;
  });

  it("should detect duplicate phone number record by pkey", () => {
    expect(hasDuplicatePhoneNumberRecord(mockPhoneNumberRecords, mockPhoneNumberRecord, pkeyFilter)).toBe(true);
  });

  it("should not detect duplicate phone number record by pkey when none exists", () => {
    const newRecord = {
      pkey: "789",
      employeeId: "n003"
    } as PhoneNumberRecordType;
    expect(hasDuplicatePhoneNumberRecord(mockPhoneNumberRecords, newRecord, pkeyFilter)).toBe(false);
  });

  it("should detect duplicate phone number record by pkey and employeeId", () => {
    const newRecord = {
      pkey: "456",
      employeeId: "n002"
    } as PhoneNumberRecordType;
    expect(hasDuplicatePhoneNumberRecord(mockPhoneNumberRecords, newRecord, pkeyAndEmployeeIdFilter)).toBe(false);
  });

  it("should throw error if duplicate phone number record found", () => {
    expect(() => checkForDuplicatePhoneNumberRecord(mockPhoneNumberRecords, mockPhoneNumberRecord, pkeyFilter)).toThrow("Duplicate phone number record found");
  });

  it("should not throw error if no duplicate phone number record found", () => {
    const newRecord = {
      pkey: "789",
      employeeId: "n003"
    } as PhoneNumberRecordType;
    expect(() => checkForDuplicatePhoneNumberRecord(mockPhoneNumberRecords, newRecord, pkeyFilter)).not.toThrow();
  });

  it("should generate matching record messages for duplicates", () => {
    const newRecord = {
      pkey: "123",
      employeeId: "n001"
    } as PhoneNumberRecordType;
    const messages = generateMatchingRecordMessages(mockPhoneNumberRecords, [newRecord], pkeyFilter);
    expect(messages).toEqual(["pkey: 123, employeeId: n001"]);
  });

  it("should find matching phone number records", () => {
    const newRecord = {
      pkey: "123",
      employeeId: "n001"
    } as PhoneNumberRecordType;
    const matches = findMatchingPhoneNumberRecords(mockPhoneNumberRecords, [newRecord], pkeyFilter);
    expect(matches).toEqual([mockPhoneNumberRecord]);
  });

  it("should not find matching phone number records when none exist", () => {
    const newRecord = {
      pkey: "789",
      employeeId: "n003"
    } as PhoneNumberRecordType;
    const matches = findMatchingPhoneNumberRecords(mockPhoneNumberRecords, [newRecord], pkeyFilter);
    expect(matches).toEqual([]);
  });

  it("should detect duplicate phone number records by dynamic and legacy filter", () => {
    const newRecord = {
      pkey: "789",
      employeeId: "n001",
      phoneNumber: "1234567890"
    } as PhoneNumberRecordType;
    expect(hasDuplicatePhoneNumberRecord(mockPhoneNumberRecords, newRecord, dynamicAndLegacyPhoneNumberRecordFilter)).toBe(false);
  });
});