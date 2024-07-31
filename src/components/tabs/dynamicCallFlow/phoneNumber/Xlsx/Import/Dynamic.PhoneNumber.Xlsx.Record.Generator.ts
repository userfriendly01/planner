import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  CallerType,
  CallFlowType,
  CallFlowTypeEnum,
  LanguageOfferType,
  PhoneNumber,
  PhoneNumberType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { ActionType } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import {
  AbstractPhoneNumberXlsxRecordGenerator
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/Abstract.PhoneNumber.Xlsx.Record.Generator";

export class DynamicPhoneNumberXlsxRecordGenerator extends AbstractPhoneNumberXlsxRecordGenerator {
  protected mapPhoneNumberRecordTypeSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): PhoneNumber {
    const isSelfServiceNumberMigratingToDynamic = phoneNumberXlsxRow.migrateSelfServiceNumberToDynamic?.toLowerCase() === "true";

    return {
      phoneNumber: phoneNumberXlsxRow.dialedPhoneNumber,
      phoneNumberType: phoneNumberXlsxRow.phoneNumberType as PhoneNumberType,
      callFlowType: isSelfServiceNumberMigratingToDynamic ? CallFlowTypeEnum.SELFSERVICE : phoneNumberXlsxRow.callFlowType as CallFlowType,
      callerType: phoneNumberXlsxRow.callerType as CallerType,
      callFlowName: isSelfServiceNumberMigratingToDynamic ? CallFlowTypeEnum.SELFSERVICE : phoneNumberXlsxRow.callFlowName,
      callFlowRoute: phoneNumberXlsxRow.callFlowRoute,
      callIntent: phoneNumberXlsxRow.callIntent,
      dataRequests: phoneNumberXlsxRow.dataRequests?.split(",") || [],
      greetingMessages: phoneNumberXlsxRow.greetingMessages,
      languageOffer: phoneNumberXlsxRow.languageOffer as LanguageOfferType,
      nextActionId: phoneNumberXlsxRow.nextActionId,
      nextActionType: phoneNumberXlsxRow.nextActionType as ActionType,
      officeNumbers: phoneNumberXlsxRow.officeNumbers?.split(",") || [],
      transferDestination: phoneNumberXlsxRow.transferDestination,
      // This field will be removed once all self service numbers are migrated to dynamic call flow:
      migrateSelfServiceNumberToDynamic: isSelfServiceNumberMigratingToDynamic
    } as PhoneNumber;
  }
}