import { PhoneNumberXlsxRow } from "./PhoneNumber.Xlsx.Interfaces";

export class PhoneNumberXlsxValueInspector {
  private readonly phoneNumberValueInspectionErrors: Array<string> = [];

  public inspectValues(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<string> {
    phoneNumberXlsxRows.forEach((phoneNumberXlsxRow: PhoneNumberXlsxRow) => {

      if (!phoneNumberXlsxRow.dialedPhoneNumber || phoneNumberXlsxRow.dialedPhoneNumber.trim().length === 0) {
        this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing dialedPhoneNumber.");
      }

      // if ()

      if (phoneNumberXlsxRow.nextActionId && phoneNumberXlsxRow.nextActionType) {
        this.inspectDynamicPhoneNumber(phoneNumberXlsxRow);
      } else {
        this.inspectLegacyPhoneNumber(phoneNumberXlsxRow);
      }
    });

    return this.phoneNumberValueInspectionErrors;
  }

  private inspectDynamicPhoneNumber(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    //
  }

  private inspectLegacyPhoneNumber(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    //
  }

  private logPhoneNumberValidationError(phoneNumberXlsxRow: PhoneNumberXlsxRow, error: string): void {
    this.phoneNumberValueInspectionErrors.push(`Dialed Phone Number[${phoneNumberXlsxRow.xlsxId}] ${error}`);
  }
}