import {
  LegacyPhoneNumberXlsxRow,
  PhoneNumberXlsxRow
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import {
  CctSharedCallFlowDb,
  FlowContent
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import {
  PhoneNumberXlsxImportAbstractRecordGenerator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Abstract.Record.Generator";
import { booleanValue } from "dynamicCallFlowCommon/Util/Boolean.Util";
import { stringToArray } from "dynamicCallFlowCommon/Util/Array.Util";

export class PhoneNumberXlsxImportLegacyRecordGenerator extends PhoneNumberXlsxImportAbstractRecordGenerator {
  protected mapPhoneNumberRecordTypeSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): CctSharedCallFlowDb {
    const legacyPhoneNumberXlsxRow = phoneNumberXlsxRow as LegacyPhoneNumberXlsxRow;

    return {
      accountManager: legacyPhoneNumberXlsxRow.accountManager,
      affinityVDN: legacyPhoneNumberXlsxRow.affinityVDN,
      callDetails1: legacyPhoneNumberXlsxRow.callDetails1,
      callDetails2: legacyPhoneNumberXlsxRow.callDetails2,
      content: {
        callerType: legacyPhoneNumberXlsxRow.callerType,
        callFlowRoute: legacyPhoneNumberXlsxRow.callFlowRoute,
        callIntent: legacyPhoneNumberXlsxRow.callIntent,
        dataRequests: stringToArray(legacyPhoneNumberXlsxRow.dataRequests),
        greetingMessages: legacyPhoneNumberXlsxRow.greetingMessages,
        languageOffer: legacyPhoneNumberXlsxRow.languageOffer,
        officeNumbers: stringToArray(legacyPhoneNumberXlsxRow.officeNumbers),
        transferNumber: legacyPhoneNumberXlsxRow.transferDestination
      } as FlowContent,
      pkey: legacyPhoneNumberXlsxRow.dialedPhoneNumber,
      selfServiceIndicator: booleanValue(legacyPhoneNumberXlsxRow.selfServiceIndicator),
      type: legacyPhoneNumberXlsxRow.phoneNumberType,
      userDestination: legacyPhoneNumberXlsxRow.userDestination
    } as CctSharedCallFlowDb;
  }
}