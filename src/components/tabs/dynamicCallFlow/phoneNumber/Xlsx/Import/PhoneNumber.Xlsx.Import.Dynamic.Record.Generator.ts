import { PhoneNumber } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  PhoneNumberXlsxImportAbstractRecordGenerator
} from "dynamicCallFlowPhoneNumber/Xlsx/Import/PhoneNumber.Xlsx.Import.Abstract.Record.Generator";
import {
  DynamicPhoneNumberXlsxRow,
  PhoneNumberXlsxRow
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { isTrue } from "dynamicCallFlowCommon/Util/Boolean.Util";
import { stringToArray } from "dynamicCallFlowCommon/Util/Array.Util";

export class PhoneNumberXlsxImportDynamicRecordGenerator extends PhoneNumberXlsxImportAbstractRecordGenerator {
  protected mapPhoneNumberRecordTypeSpecificFields(phoneNumberXlsxRow: PhoneNumberXlsxRow): PhoneNumber {
    const dynamicPhoneNumberXlsxRow = phoneNumberXlsxRow as DynamicPhoneNumberXlsxRow;

    return {
      phoneNumber: dynamicPhoneNumberXlsxRow.dialedPhoneNumber,
      phoneNumberType: dynamicPhoneNumberXlsxRow.phoneNumberType,
      callFlowType: dynamicPhoneNumberXlsxRow.callFlowType,
      callerType: dynamicPhoneNumberXlsxRow.callerType,
      callFlowName: dynamicPhoneNumberXlsxRow.callFlowName,
      callFlowRoute: dynamicPhoneNumberXlsxRow.callFlowRoute,
      callIntent: dynamicPhoneNumberXlsxRow.callIntent,
      dataRequests: stringToArray(dynamicPhoneNumberXlsxRow.dataRequests),
      greetingMessages: dynamicPhoneNumberXlsxRow.greetingMessages,
      languageOffer: dynamicPhoneNumberXlsxRow.languageOffer,
      migrateSelfServiceNumberToDynamic: isTrue(dynamicPhoneNumberXlsxRow.migrateSelfServiceNumberToDynamic),
      nextActionId: dynamicPhoneNumberXlsxRow.nextActionId,
      nextActionType: dynamicPhoneNumberXlsxRow.nextActionType,
      officeNumbers: stringToArray(dynamicPhoneNumberXlsxRow.officeNumbers),
      transferDestination: dynamicPhoneNumberXlsxRow.transferDestination
    } as PhoneNumber;
  }
}