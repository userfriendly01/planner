import { PhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";

export interface PhoneNumberXlsxImportValidator {
  validate(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<string>;
}