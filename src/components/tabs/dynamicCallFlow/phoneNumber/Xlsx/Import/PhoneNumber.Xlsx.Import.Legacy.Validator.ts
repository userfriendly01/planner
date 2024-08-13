import {
  PhoneNumberXlsxImportAbstractValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Abstract.Validator";
import { LegacyPhoneNumberXlsxRow } from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";

export class PhoneNumberXlsxImportLegacyValidator extends PhoneNumberXlsxImportAbstractValidator {
  /**
   * Inspects and validates phone number fields specific to legacy phone numbers.
   * @param legacyPhoneNumberXlsxRow - The phone number row to inspect.
   */
  protected validateUncommonPhoneNumberFields(legacyPhoneNumberXlsxRow: LegacyPhoneNumberXlsxRow): void {
    // need to find out if agentId is the same format as employeeId
    // if (legacyPhoneNumberXlsxRow.agentId && employeeIdIsNotValid(legacyPhoneNumberXlsxRow.agentId)) {
    //   this.logInvalidValueMessage(legacyPhoneNumberXlsxRow.dialedPhoneNumber, AGENT_ID, legacyPhoneNumberXlsxRow.agentId);
    // } // may need an else if check if agentId is required for certain brands
  }
}