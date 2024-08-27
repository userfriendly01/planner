import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberXlsxRow } from "components/tabs/dynamicCallFlow/phoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TYPE,
  CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  INTERNET_PLACEMENT,
  LANGUAGE_OFFER,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL,
  OFFICE_NUMBERS,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TOLL_FREE_NUMBER,
  TRANSFER_CODE,
  WHISPER
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";

export abstract class AbstractPhoneNumberXlsxExportRowGenerator {
  convertRecordsToXlsxRows(phoneNumberRecords: Array<PhoneNumberRecordType>): Array<PhoneNumberXlsxRow> {
    const phoneNumberXlsxRows: Array<PhoneNumberXlsxRow> = [];

    phoneNumberRecords.forEach((phoneNumberRecord: PhoneNumberRecordType) => {
      phoneNumberXlsxRows.push({
        ...this.mapCommonPhoneNumberRecordFields(phoneNumberRecord),
        ...this.mapPhoneNumberRecordTypeSpecificFields(phoneNumberRecord)
      });
    });

    return this.reorderXlsxRowForHeaders(phoneNumberXlsxRows);
  }

  private mapCommonPhoneNumberRecordFields(phoneNumberRecord: PhoneNumberRecordType): PhoneNumberXlsxRow {
    return {
      dialedPhoneNumber: PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord),
      brand: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, BRAND),
      employeeId: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, EMPLOYEE_ID),
      callFlowTemplate: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, CALL_FLOW_TEMPLATE),
      callFlowType: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, CALL_FLOW_TYPE),
      callTypeDescription: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, CALL_TYPE_DESCRIPTION),
      channel: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, CHANNEL),
      callFlowRoute: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, CALL_FLOW_ROUTE),
      callIntent: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, CALL_INTENT),
      callerType: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, CALLER_TYPE),
      dataRequests: PhoneNumberRecordUtil.getPropertyArrayValueAsString(phoneNumberRecord, DATA_REQUESTS),
      greetingMessages: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, GREETING_MESSAGES),
      languageOffer: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, LANGUAGE_OFFER),
      officeNumbers: PhoneNumberRecordUtil.getPropertyArrayValueAsString(phoneNumberRecord, OFFICE_NUMBERS),
      dialedDescription: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, DIALED_DESCRIPTION),
      internetPlacement: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, INTERNET_PLACEMENT),
      lineOfBusiness: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, LINE_OF_BUSINESS),
      marketingChannel: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, MARKETING_CHANNEL),
      predictiveCaller: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, PREDICTIVE_CALLER),
      rangeIndicator: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, RANGE_INDICATOR),
      requestID: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, REQUEST_ID),
      tfnRoutingGroup: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, TFN_ROUTING_GROUP),
      tollFreeNumber: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, TOLL_FREE_NUMBER),
      transferCode: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, TRANSFER_CODE),
      whisper: PhoneNumberRecordUtil.getPropertyStringValue(phoneNumberRecord, WHISPER)
    } as PhoneNumberXlsxRow;
  }

  protected abstract mapPhoneNumberRecordTypeSpecificFields(phoneNumberRecord: PhoneNumberRecordType): PhoneNumberXlsxRow;

  protected abstract reorderXlsxRowForHeaders(xlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberXlsxRow>;
}

