import { ActionType } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import {
  CallerType,
  CallFlowType,
  LanguageOfferType,
  PhoneNumber,
  PhoneNumberType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  AbstractPhoneNumberXlsxRecordGenerator
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/Abstract.PhoneNumber.Xlsx.Record.Generator";
import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";

export class DynamicPhoneNumberXlsxRecordGenerator extends AbstractPhoneNumberXlsxRecordGenerator {
  protected mapPhoneNumberRecordTypeSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): PhoneNumber {
    return {
      phoneNumber: phoneNumberXlsxRow.dialedPhoneNumber,
      phoneNumberType: phoneNumberXlsxRow.phoneNumberType as PhoneNumberType,
      callFlowType: phoneNumberXlsxRow.callFlowType as CallFlowType,
      callerType: phoneNumberXlsxRow.callerType as CallerType,
      callFlowName: phoneNumberXlsxRow.callFlowName,
      callFlowRoute: phoneNumberXlsxRow.callFlowRoute,
      callIntent: phoneNumberXlsxRow.callIntent,
      dataRequests: phoneNumberXlsxRow.dataRequests?.split(",") || [],
      greetingMessages: phoneNumberXlsxRow.greetingMessages,
      languageOffer: phoneNumberXlsxRow.languageOffer as LanguageOfferType,
      nextActionId: phoneNumberXlsxRow.nextActionId,
      nextActionType: phoneNumberXlsxRow.nextActionType as ActionType,
      officeNumbers: phoneNumberXlsxRow.officeNumbers?.length > 0 ? phoneNumberXlsxRow.officeNumbers.split(",") : [],
      transferDestination: phoneNumberXlsxRow.transferDestination,
      migrateSelfServiceNumberToDynamic: phoneNumberXlsxRow.migrateSelfServiceNumberToDynamic?.toLowerCase() === "true"
    } as PhoneNumber;
  }
}