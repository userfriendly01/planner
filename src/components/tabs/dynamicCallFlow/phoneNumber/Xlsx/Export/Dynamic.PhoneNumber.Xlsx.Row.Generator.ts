import { PhoneNumber } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { AbstractPhoneNumberXlsxRowGenerator } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Export/Abstract.PhoneNumber.Xlsx.Row.Generator";

export class DynamicPhoneNumberXlsxRowGenerator extends AbstractPhoneNumberXlsxRowGenerator {
  protected getPhoneNumberRecordType(): string {
    return "DynamicPhoneNumber";
  }

  protected mapPhoneNumberRecordTypeSpecificFields(phoneNumber: PhoneNumber): PhoneNumberXlsxRow {
    return {
      callFlowName: phoneNumber.callFlowName,
      phoneNumberType: phoneNumber.phoneNumberType,
      callFlowType: phoneNumber.callFlowType,
      nextActionId: phoneNumber.nextActionId,
      nextActionType: phoneNumber.nextActionType,
      transferDestination: phoneNumber.transferDestination
    } as PhoneNumberXlsxRow;
  }

  protected reorderXlsxRowForHeaders(xlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow> {
    return xlsxRows.map((xlsxRow: PhoneNumberXlsxRow) => ({
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

