import {
  PhoneNumber
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  DynamicPhoneNumberXlsxRow,
  PhoneNumberXlsxRow
} from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { AbstractPhoneNumberXlsxExportRowGenerator } from "dynamicCallFlowPhoneNumber/Xlsx/Export/Abstract.PhoneNumber.Xlsx.Export.Row.Generator";
import { booleanAsString } from "dynamicCallFlowCommon/Util/Boolean.Util";

export class DynamicPhoneNumberXlsxExportRowGenerator extends AbstractPhoneNumberXlsxExportRowGenerator {
  protected mapPhoneNumberRecordTypeSpecificFields(phoneNumber: PhoneNumber): PhoneNumberXlsxRow {
    return {
      callFlowName: phoneNumber.callFlowName,
      callFlowType: phoneNumber.callFlowType,
      migrateSelfServiceNumberToDynamic: booleanAsString(phoneNumber.migrateSelfServiceNumberToDynamic),
      nextActionId: phoneNumber.nextActionId,
      nextActionType: phoneNumber.nextActionType,
      phoneNumberType: phoneNumber.phoneNumberType,
      transferDestination: phoneNumber.transferDestination
    } as PhoneNumberXlsxRow;
  }

  protected reorderXlsxRowForHeaders(xlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow> {
    return xlsxRows.map((xlsxRow: DynamicPhoneNumberXlsxRow) => ({
      dialedPhoneNumber: xlsxRow.dialedPhoneNumber,
      brand: xlsxRow.brand,
      employeeId: xlsxRow.employeeId,
      callFlowName: xlsxRow.callFlowName,
      callFlowTemplate: xlsxRow.callFlowTemplate,
      callFlowType: xlsxRow.callFlowType,
      callTypeDescription: xlsxRow.callTypeDescription,
      channel: xlsxRow.channel,
      callFlowRoute: xlsxRow.callFlowRoute,
      callIntent: xlsxRow.callIntent,
      callerType: xlsxRow.callerType,
      dataRequests: xlsxRow.dataRequests,
      greetingMessages: xlsxRow.greetingMessages,
      languageOffer: xlsxRow.languageOffer,
      officeNumbers: xlsxRow.officeNumbers,
      transferDestination: xlsxRow.transferDestination,
      dialedDescription: xlsxRow.dialedDescription,
      internetPlacement: xlsxRow.internetPlacement,
      lineOfBusiness: xlsxRow.lineOfBusiness,
      marketingChannel: xlsxRow.marketingChannel,
      migrateSelfServiceNumberToDynamic: xlsxRow.migrateSelfServiceNumberToDynamic,
      nextActionId: xlsxRow.nextActionId,
      nextActionType: xlsxRow.nextActionType,
      phoneNumberType: xlsxRow.phoneNumberType,
      predictiveCaller: xlsxRow.predictiveCaller,
      rangeIndicator: xlsxRow.rangeIndicator,
      requestID: xlsxRow.requestID,
      tfnRoutingGroup: xlsxRow.tfnRoutingGroup,
      tollFreeNumber: xlsxRow.tollFreeNumber,
      transferCode: xlsxRow.transferCode,
      whisper: xlsxRow.whisper
    } as PhoneNumberXlsxRow));
  }
}

