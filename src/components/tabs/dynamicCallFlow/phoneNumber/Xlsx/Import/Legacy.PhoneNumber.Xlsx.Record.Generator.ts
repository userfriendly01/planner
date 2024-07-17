import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  CallerType,
  LanguageOfferType,
  UserDestinationType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  CctSharedCallFlowDb,
  FlowContent,
  LegacyPhoneNumberType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import {
  AbstractPhoneNumberXlsxRecordGenerator
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Import/Abstract.PhoneNumber.Xlsx.Record.Generator";

export class LegacyPhoneNumberXlsxRecordGenerator extends AbstractPhoneNumberXlsxRecordGenerator {
  protected mapPhoneNumberRecordTypeSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): CctSharedCallFlowDb {
    return {
      pkey: phoneNumberXlsxRow.dialedPhoneNumber,
      type: phoneNumberXlsxRow.phoneNumberType as LegacyPhoneNumberType,
      accountManager: phoneNumberXlsxRow.accountManager,
      affinityVDN: phoneNumberXlsxRow.affinityVDN,
      callDetails1: phoneNumberXlsxRow.callDetails1,
      callDetails2: phoneNumberXlsxRow.callDetails2,
      userDestination: phoneNumberXlsxRow.userDestination as UserDestinationType,
      content: {
        languageOffer: phoneNumberXlsxRow.languageOffer as LanguageOfferType,
        dataRequests: phoneNumberXlsxRow.dataRequests?.split(",") || [],
        callerType: phoneNumberXlsxRow.callerType as CallerType,
        callFlowRoute: phoneNumberXlsxRow.callFlowRoute,
        greetingMessages: phoneNumberXlsxRow.greetingMessages,
        callIntent: phoneNumberXlsxRow.callIntent,
        officeNumbers: phoneNumberXlsxRow.officeNumbers?.split(",") || []
      } as FlowContent
    } as CctSharedCallFlowDb;
  }
}