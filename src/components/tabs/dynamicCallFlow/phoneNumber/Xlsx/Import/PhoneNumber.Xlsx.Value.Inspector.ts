import { PhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";

export class PhoneNumberXlsxValueInspector {
  private readonly phoneNumberValueInspectionErrors: Array<string> = [];

  public inspectValues(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<string> {
    phoneNumberXlsxRows.forEach((phoneNumberXlsxRow: PhoneNumberXlsxRow) => {
      this.inspectCommonPhoneNumberFields(phoneNumberXlsxRow);

      if (phoneNumberXlsxRow.nextActionId && phoneNumberXlsxRow.nextActionType) {
        this.inspectDynamicPhoneNumberSpecificFields(phoneNumberXlsxRow);
      } else {
        this.inspectLegacyPhoneNumberSpecificFields(phoneNumberXlsxRow);
      }
    });

    return this.phoneNumberValueInspectionErrors;
  }

  private inspectCommonPhoneNumberFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    if (!phoneNumberXlsxRow.dialedPhoneNumber || phoneNumberXlsxRow.dialedPhoneNumber.trim().length === 0) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing dialedPhoneNumber.");
    }
  }

  private inspectDynamicPhoneNumberSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    // add validation here
  }

  private inspectLegacyPhoneNumberSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    // add validation here
  }

  private logPhoneNumberValidationError(phoneNumberXlsxRow: PhoneNumberXlsxRow, error: string): void {
    this.phoneNumberValueInspectionErrors.push(`Dialed Phone Number[${phoneNumberXlsxRow.dialedPhoneNumber}] ${error}`);
  }
}