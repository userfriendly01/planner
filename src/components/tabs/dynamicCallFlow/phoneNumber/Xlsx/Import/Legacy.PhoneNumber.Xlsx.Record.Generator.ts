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
        callerType: phoneNumberXlsxRow.callerType as CallerType,
        callFlowRoute: phoneNumberXlsxRow.callFlowRoute,
        callIntent: phoneNumberXlsxRow.callIntent,
        dataRequests: phoneNumberXlsxRow.dataRequests?.split(",") || [],
        greetingMessages: phoneNumberXlsxRow.greetingMessages,
        languageOffer: phoneNumberXlsxRow.languageOffer as LanguageOfferType,
        officeNumbers: phoneNumberXlsxRow.officeNumbers?.length > 0 ? phoneNumberXlsxRow.officeNumbers.split(",") : [],
        transferNumber: phoneNumberXlsxRow.transferDestination
      } as FlowContent
    } as CctSharedCallFlowDb;
  }
}