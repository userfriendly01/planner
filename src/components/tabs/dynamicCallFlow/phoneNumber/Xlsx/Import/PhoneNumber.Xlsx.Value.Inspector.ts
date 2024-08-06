import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  BrandTypeEnum,
  CallFlowTypeEnum, ChannelTypeEnum, LanguageOfferTypeEnum, PhoneNumberTypeEnum
} from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";

/**
 * Inspects and validates the values associated with each phone number row uploaded from an XLSX file.
 */
export class PhoneNumberXlsxValueInspector {
  private readonly phoneNumberValueInspectionErrors: Array<string> = [];

  /**
   * Inspects and validates the values associated with each phone number row uploaded from an XLSX file.
   * @param phoneNumberXlsxRows - The phone number rows to inspect.
   * @returns - An array of error messages for each phone number row that failed inspection.
   */
  public inspectValues(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<string> {
    phoneNumberXlsxRows.forEach((phoneNumberXlsxRow: PhoneNumberXlsxRow) => {
      this.stagePhoneNumberValues(phoneNumberXlsxRow);
      this.inspectCommonPhoneNumberFields(phoneNumberXlsxRow);

      if ((phoneNumberXlsxRow.nextActionId) || phoneNumberXlsxRow.migrateSelfServiceNumberToDynamic?.toLowerCase() === "true") {
        this.inspectDynamicPhoneNumberSpecificFields(phoneNumberXlsxRow);
      } else {
        this.inspectLegacyPhoneNumberSpecificFields(phoneNumberXlsxRow);
      }
    });

    return this.phoneNumberValueInspectionErrors;
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
    if (phoneNumberXlsxRow.migrateSelfServiceNumberToDynamic?.toLowerCase() === "true") {
      // These are fields that should be automatically set for migrated self service phone numbers:
      phoneNumberXlsxRow.callFlowName = CallFlowTypeEnum.SELFSERVICE;
      phoneNumberXlsxRow.callFlowType = CallFlowTypeEnum.SELFSERVICE;
      delete phoneNumberXlsxRow.nextActionId;
      delete phoneNumberXlsxRow.nextActionType;
    }
  }

  /**
   * Inspects and validates phone number fields shared between dynamic and legacy phone numbers.
   * @param phoneNumberXlsxRow - The phone number row to inspect.
   */
  private inspectCommonPhoneNumberFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    // Required field validation:
    if (!phoneNumberXlsxRow.dialedPhoneNumber) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing dialedPhoneNumber.");
    }
    if (!phoneNumberXlsxRow.dialedDescription) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing dialedDescription.");
    }
    if (!phoneNumberXlsxRow.phoneNumberType || !Object.values(PhoneNumberTypeEnum).includes(phoneNumberXlsxRow.phoneNumberType as PhoneNumberTypeEnum)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing or invalid phoneNumberType.");
    }
    if (!phoneNumberXlsxRow.callFlowTemplate) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing callFlowTemplate.");
    }
    if (!phoneNumberXlsxRow.channel || !Object.values(ChannelTypeEnum).includes(phoneNumberXlsxRow.channel as ChannelTypeEnum)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing or invalid channel.");
    }
    if (!phoneNumberXlsxRow.brand || !Object.values(BrandTypeEnum).includes(phoneNumberXlsxRow.brand as BrandTypeEnum)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing or invalid brand.");
    }
    if (!phoneNumberXlsxRow.greetingMessages) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing greetingMessages.");
    }
    if (!phoneNumberXlsxRow.languageOffer || !Object.values(LanguageOfferTypeEnum).includes(phoneNumberXlsxRow.languageOffer as LanguageOfferTypeEnum)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing or invalid languageOffer.");
    }

    // Optional field validation:
    if (!this.isBooleanXlsxValueValid(phoneNumberXlsxRow.predictiveCaller)) {
      phoneNumberXlsxRow.predictiveCaller = "false";
    }
    if (phoneNumberXlsxRow.employeeId && !phoneNumberXlsxRow.employeeId.startsWith("n")) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing or invalid employeeId.");
    }
    if (!this.isBooleanXlsxValueValid(phoneNumberXlsxRow.migrateSelfServiceNumberToDynamic)) {
      phoneNumberXlsxRow.migrateSelfServiceNumberToDynamic = "false";
    }
    if (phoneNumberXlsxRow.dialedPhoneNumber && !/^\+1\d+$/.test(phoneNumberXlsxRow.dialedPhoneNumber)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "dialedPhoneNumber must be in the format +###########.");
    }
    if (phoneNumberXlsxRow.greetingMessages) {
      const xmlString = phoneNumberXlsxRow.greetingMessages.startsWith("<")? phoneNumberXlsxRow.greetingMessages : "<speak>" + phoneNumberXlsxRow.greetingMessages + "</speak>";
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, "application/xml");
      const errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        this.logPhoneNumberValidationError(phoneNumberXlsxRow, "greetingMessage contains invalid content (like &)");
      }
    }
  }

  /**
   * Inspects and validates phone number fields specific to dynamic phone numbers.
   * @param phoneNumberXlsxRow - The phone number row to inspect.
   */
  private inspectDynamicPhoneNumberSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    // transferDestination is only required for dynamic phone numbers:
    if (!phoneNumberXlsxRow.transferDestination) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing transferDestination.");
    }
    if (!phoneNumberXlsxRow.callFlowName) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing callFlowName.");
    }
    if (!phoneNumberXlsxRow.callFlowType || !Object.values(CallFlowTypeEnum).includes(phoneNumberXlsxRow.callFlowType as CallFlowTypeEnum)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "missing or invalid callFlowType.");
    }
    if ([phoneNumberXlsxRow.nextActionId, phoneNumberXlsxRow.nextActionType].filter(value => Boolean(value)).length === 1) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "nextActionId and nextActionType must be provided together.");
    }
    if (Boolean(phoneNumberXlsxRow.nextActionType) && !Object.keys(ActionTypeEnum).includes(phoneNumberXlsxRow.nextActionType)) {
      this.logPhoneNumberValidationError(phoneNumberXlsxRow, "invalid nextActionType.");
    }
  }

  /**
   * Inspects and validates phone number fields specific to legacy phone numbers.
   * @param phoneNumberXlsxRow - The phone number row to inspect.
   */
  private inspectLegacyPhoneNumberSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): void {
    if (!this.isBooleanXlsxValueValid(phoneNumberXlsxRow.selfServiceIndicator)) {
      phoneNumberXlsxRow.selfServiceIndicator = "false";
    }
  }

  /**
   * Determines if boolean value from XLSX value is a valid.
   * @param value - The stringified boolean value from the XLSX file.
   * @returns - True if the value is a valid boolean, false otherwise.
   */
  private isBooleanXlsxValueValid(value: string): boolean {
    return ["true", "false"].includes(value?.toLowerCase());
  }

  /**
   * Adds a phone number validation error to the list of inspection errors.
   * @param phoneNumberXlsxRow - The phone number row that failed inspection.
   * @param error - The error message to log.
   */
  private logPhoneNumberValidationError(phoneNumberXlsxRow: PhoneNumberXlsxRow, error: string): void {
    this.phoneNumberValueInspectionErrors.push(`Dialed Phone Number[${phoneNumberXlsxRow.dialedPhoneNumber}] ${error}`);
  }
}