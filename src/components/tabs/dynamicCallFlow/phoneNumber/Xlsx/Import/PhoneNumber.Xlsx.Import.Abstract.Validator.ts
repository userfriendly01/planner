import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  BrandTypeEnum,
  ChannelTypeEnum,
  LanguageOfferTypeEnum,
  PhoneNumberTypeEnum
} from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  BRAND,
  CALL_FLOW_TEMPLATE,
  CHANNEL,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  PHONE_NUMBER_TYPE
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  PhoneNumberXlsxImportValidator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Interface";
import { employeeIdIsNotValid, phoneNumberIsNotValid } from "dynamicCallFlowCommon/GraphQL/Field.Validation.GraphQL";

export function buildErrorMessage(dialedPhoneNumber: string, message: string): string {
  return `Dialed Phone Number[${dialedPhoneNumber}] ${message}`;
}

export function invalidValueMessage(key: string, value: string): string {
  return `${value} is an invalid ${key}.`;
}

export function missingValueMessage(key: string): string {
  return `missing ${key}.`;
}

/**
 * Inspects and validates the values associated with each phone number row uploaded from an XLSX file.
 */
export abstract class PhoneNumberXlsxImportAbstractValidator implements PhoneNumberXlsxImportValidator {
  private _phoneNumberValueInspectionErrors: Array<string>;

  /**
   * Inspects and validates the values associated with each phone number row uploaded from an XLSX file.
   * @param phoneNumberXlsxRows - The phone number rows to inspect.
   * @returns - An array of error messages for each phone number row that failed inspection.
   */
  public validate(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<string> {
    this._phoneNumberValueInspectionErrors = [];
    phoneNumberXlsxRows.forEach((phoneNumberXlsxRow: PhoneNumberXlsxRow) => {
      this.stagePhoneNumberValues(phoneNumberXlsxRow);
      this.validateCommonPhoneNumberFields(phoneNumberXlsxRow);
      this.validateUncommonPhoneNumberFields(phoneNumberXlsxRow);
    });

    return this._phoneNumberValueInspectionErrors;
  }

  /**
   * Stages phone number values for inspection by removing leading/trailing whitespace and setting default values for migrated self service phone numbers.
   * @param phoneNumberXlsxRow - The phone number row to stage values for.
   */
  private stagePhoneNumberValues(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    Object.keys(phoneNumberXlsxRow).forEach((key: keyof PhoneNumberXlsxRow) => {
      if (typeof phoneNumberXlsxRow[key] === "string") {
        phoneNumberXlsxRow[key] = phoneNumberXlsxRow[key]?.trim();
      }
    });
  }

  /**
   * Inspects and validates phone number fields shared between dynamic and legacy phone numbers.
   * @param phoneNumberXlsxRow - The phone number row to inspect.
   */
  private validateCommonPhoneNumberFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    this.validateRequiredKey(phoneNumberXlsxRow, "dialedPhoneNumber");
    if (phoneNumberXlsxRow.dialedPhoneNumber && phoneNumberIsNotValid(phoneNumberXlsxRow.dialedPhoneNumber)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow.dialedPhoneNumber, "dialedPhoneNumber must be in the format +###########.");
    }

    this.validateRequiredKeyEnumType(phoneNumberXlsxRow, BRAND, BrandTypeEnum);
    this.validateRequiredKey(phoneNumberXlsxRow, CALL_FLOW_TEMPLATE);
    this.validateRequiredKeyEnumType(phoneNumberXlsxRow, CHANNEL, ChannelTypeEnum);
    this.validateRequiredKey(phoneNumberXlsxRow, DIALED_DESCRIPTION);
    this.validateRequiredKey(phoneNumberXlsxRow, GREETING_MESSAGES);

    //TODO: Uncomment when we have a better way to validate XML content
    // if (containsXml(phoneNumberXlsxRow.greetingMessages) && isNotValidXml(phoneNumberXlsxRow.greetingMessages)) {
    //   this.logPhoneNumberValidationError(phoneNumberXlsxRow.dialedPhoneNumber, "greetingMessages contains invalid content (like &)");
    // }

    this.validateRequiredKeyEnumType(phoneNumberXlsxRow, LANGUAGE_OFFER, LanguageOfferTypeEnum);
    this.validateRequiredKeyEnumType(phoneNumberXlsxRow, PHONE_NUMBER_TYPE, PhoneNumberTypeEnum);


    //TODO: Uncomment when we have a better way to validate employeeId
    // if (PhoneNumberTypeEnum.DID === phoneNumberXlsxRow.phoneNumberType) { // Required for COMPARION brand:
    //   this.validateRequiredKey(phoneNumberXlsxRow, EMPLOYEE_ID);
    // }

    if (phoneNumberXlsxRow.employeeId && employeeIdIsNotValid(phoneNumberXlsxRow.employeeId)) {
      this.logInvalidValueMessage(phoneNumberXlsxRow.dialedPhoneNumber, EMPLOYEE_ID, phoneNumberXlsxRow.employeeId);
    }
  }

  protected abstract validateUncommonPhoneNumberFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected validateRequiredKeyEnumType(phoneNumberXlsxRow: PhoneNumberXlsxRow, key: string, enumType: any): void {
    this.validateRequiredKey(phoneNumberXlsxRow, key);
    this.validateEnumTypeField(phoneNumberXlsxRow, key, enumType);
  }

  protected validateRequiredKey(phoneNumberXlsxRow: PhoneNumberXlsxRow, key: string): void {
    if (!phoneNumberXlsxRow[key as keyof PhoneNumberXlsxRow]) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow.dialedPhoneNumber, missingValueMessage(key));
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected validateEnumTypeField(phoneNumberXlsxRow: PhoneNumberXlsxRow, key: string, enumType: any): void {
    const value = phoneNumberXlsxRow[key as keyof PhoneNumberXlsxRow];

    if (value && !Object.values(enumType).includes(value)) {
      this.logInvalidValueMessage(phoneNumberXlsxRow.dialedPhoneNumber, key, value);
    }
  }

  protected logInvalidValueMessage(dialedPhoneNumber: string, key: string, value: string): void {
    this.logPhoneNumberValidationError(dialedPhoneNumber, invalidValueMessage(key, value));
  }

  /**
   * Adds a phone number validation error to the list of inspection errors.
   * @param dialedPhoneNumber - The phone number row that failed inspection.
   * @param message - The error message to log.
   */
  protected logPhoneNumberValidationError(dialedPhoneNumber: string, message: string): void {
    this._phoneNumberValueInspectionErrors.push(buildErrorMessage(dialedPhoneNumber, message));
  }
}