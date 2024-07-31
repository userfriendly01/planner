import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { AbstractPhoneNumberXlsxRowGenerator } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/Export/Abstract.PhoneNumber.Xlsx.Row.Generator";

export class LegacyPhoneNumberXlsxRowGenerator extends AbstractPhoneNumberXlsxRowGenerator {
  protected getPhoneNumberRecordType(): string {
    return "LegacyPhoneNumber";
  }

  protected mapPhoneNumberRecordTypeSpecificFields(legacyPhoneNumber: CctSharedCallFlowDb): PhoneNumberXlsxRow {
    return {
      phoneNumberType: legacyPhoneNumber.type,
      accountManager: legacyPhoneNumber.accountManager,
      affinityVDN: legacyPhoneNumber.affinityVDN,
      agentId: legacyPhoneNumber.agentId,
      callDetails1: legacyPhoneNumber.callDetails1,
      callDetails2: legacyPhoneNumber.callDetails2,
      selfServiceIndicator: legacyPhoneNumber.selfServiceIndicator ? "TRUE" : "FALSE",
      transferDestination: legacyPhoneNumber.content?.transferNumber,
      userDestination: legacyPhoneNumber.userDestination
    } as PhoneNumberXlsxRow;
  }

  protected reorderXlsxRowForHeaders(xlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow> {
    return xlsxRows.map((xlsxRow: PhoneNumberXlsxRow) => ({
      dialedPhoneNumber: xlsxRow.dialedPhoneNumber,
      accountManager: xlsxRow.accountManager,
      affinityVDN: xlsxRow.affinityVDN,
      agentId: xlsxRow.agentId,
      brand: xlsxRow.brand,
      employeeId: xlsxRow.employeeId,
      callDetails1: xlsxRow.callDetails1,
      callDetails2: xlsxRow.callDetails2,
      callFlowTemplate: xlsxRow.callFlowTemplate,
      callTypeDescription: xlsxRow.callTypeDescription,
      channel: xlsxRow.channel,
      callFlowRoute: xlsxRow.callFlowRoute,
      callIntent: xlsxRow.callIntent,
      callerType: xlsxRow.callerType,
      dataRequests: xlsxRow.dataRequests,
      greetingMessages: xlsxRow.greetingMessages,
      languageOffer: xlsxRow.languageOffer,
      officeNumbers: xlsxRow.officeNumbers,
      dialedDescription: xlsxRow.dialedDescription,
      internetPlacement: xlsxRow.internetPlacement,
      lineOfBusiness: xlsxRow.lineOfBusiness,
      marketingChannel: xlsxRow.marketingChannel,
      phoneNumberType: xlsxRow.phoneNumberType,
      predictiveCaller: xlsxRow.predictiveCaller,
      rangeIndicator: xlsxRow.rangeIndicator,
      requestID: xlsxRow.requestID,
      selfServiceIndicator: xlsxRow.selfServiceIndicator,
      tfnRoutingGroup: xlsxRow.tfnRoutingGroup,
      tollFreeNumber: xlsxRow.tollFreeNumber,
      transferCode: xlsxRow.transferCode,
      transferDestination: xlsxRow.transferDestination,
      userDestination: xlsxRow.userDestination,
      whisper: xlsxRow.whisper
    } as PhoneNumberXlsxRow));
  }
}

