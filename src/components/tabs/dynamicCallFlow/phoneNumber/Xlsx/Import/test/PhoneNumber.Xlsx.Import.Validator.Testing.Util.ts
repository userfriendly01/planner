import { PhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  PhoneNumberXlsxImportValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Interface";
import { buildErrorMessage } from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Abstract.Validator";

export class PhoneNumberXlsxImportValidatorTestingUtil {
  private readonly _validator: PhoneNumberXlsxImportValidator;

  constructor(validator: PhoneNumberXlsxImportValidator) {
    this._validator = validator;
  }

  shouldNotContainErrorMessageTest(xlsxRow: PhoneNumberXlsxRow): void {
    const errors = this._validator.validate([xlsxRow]);
    expect(errors).toBeTruthy();
    expect(errors.length).toEqual(0);
    // expect(errors.filter(errorMessage => errorMessage === message).length).toEqual(0);
  }

  errorPathTest(key: string, value: string, xlsxRow: PhoneNumberXlsxRow, message: string): void {
    xlsxRow[key as keyof PhoneNumberXlsxRow] = value;
    const errors = this._validator.validate([xlsxRow]);
    expect(errors).toBeTruthy();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.find(errorMessage => errorMessage === message)).toStrictEqual(message);
  }

  missingElementTest(key: string, xlsxRow: PhoneNumberXlsxRow): void {
    this.errorPathTest(key, "", xlsxRow, `Dialed Phone Number[${xlsxRow.dialedPhoneNumber}] missing ${key}.`);
  }

  elementShouldBeMissingTest(key: string, xlsxRow: PhoneNumberXlsxRow, message: string): void {
    this.errorPathTest(key, "should not be here", xlsxRow, buildErrorMessage(xlsxRow.dialedPhoneNumber, message));
  }

  invalidElementTest(key: string, value: string, xlsxRow: PhoneNumberXlsxRow, overrideMessage?: string): void {
    const message = overrideMessage ? overrideMessage : `Dialed Phone Number[${xlsxRow.dialedPhoneNumber}] ${value} is an invalid ${key}.`;
    this.errorPathTest(key, value, xlsxRow, message);
  }
}