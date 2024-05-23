import {
  AbstractXlsxReader, XlsxJSONRow, XlsxReaderResults
} from "../../../../common/XlsxReader/AbstractXlsxReader";
import {
  BrandType,
  CallerType,
  CallFlowType,
  ChannelType,
  LanguageOfferType,
  NextActionType,
  PhoneNumber,
  PhoneNumberType
} from "../GraphQL/DynamicPhoneNumber.Interfaces";
import {
  BRAND,
  CALL_FLOW_NAME,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TYPE,
  CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  CHANNEL,
  CREATE_TIME,
  DATA_REQUESTS,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  INTERNET_PLACEMENT,
  LANGUAGE_OFFER,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  OFFICE_NUMBERS,
  PHONE_NUMBER,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TOLL_FREE_NUMBER,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  UPDATE_TIME,
  WHISPER
} from "../Field/DynamicPhoneNumberFields";

class DynamicPhoneNumberXlsxReader extends AbstractXlsxReader<PhoneNumber> {
  protected mapXlsxJSONRowToRecord(xlsxJSONRow: XlsxJSONRow): PhoneNumber {
    return {
      brand: xlsxJSONRow[BRAND] as BrandType,
      callFlowTemplate: xlsxJSONRow[CALL_FLOW_TEMPLATE] as string,
      callTypeDescription: xlsxJSONRow[CALL_TYPE_DESCRIPTION] as string,
      channel: xlsxJSONRow[CHANNEL] as ChannelType,
      dialedDescription: xlsxJSONRow[DIALED_DESCRIPTION] as string,
      employeeId: xlsxJSONRow[EMPLOYEE_ID] as string,
      internetPlacement: xlsxJSONRow[INTERNET_PLACEMENT] as string,
      lineOfBusiness: xlsxJSONRow[LINE_OF_BUSINESS] as string,
      marketingChannel: xlsxJSONRow[MARKETING_CHANNEL] as string,
      predictiveCaller: xlsxJSONRow[PREDICTIVE_CALLER] as boolean,
      rangeIndicator: xlsxJSONRow[RANGE_INDICATOR] as string,
      requestID: xlsxJSONRow[REQUEST_ID] as string,
      tfnRoutingGroup: xlsxJSONRow[TFN_ROUTING_GROUP] as string,
      tollFreeNumber: xlsxJSONRow[TOLL_FREE_NUMBER] as string,
      transferCode: xlsxJSONRow[TRANSFER_CODE] as string,
      whisper: xlsxJSONRow[WHISPER] as string,
      callerType: xlsxJSONRow[CALLER_TYPE] as CallerType,
      callFlowName: xlsxJSONRow[CALL_FLOW_NAME] as string,
      callFlowType: xlsxJSONRow[CALL_FLOW_TYPE] as CallFlowType,
      callFlowRoute: xlsxJSONRow[CALL_FLOW_ROUTE] as string,
      callIntent: xlsxJSONRow[CALL_INTENT] as string,
      createTime: xlsxJSONRow[CREATE_TIME] as number,
      dataRequests: xlsxJSONRow[DATA_REQUESTS] as Array<string>,
      greetingMessages: xlsxJSONRow[GREETING_MESSAGES] as string,
      languageOffer: xlsxJSONRow[LANGUAGE_OFFER] as LanguageOfferType,
      nextActionId: xlsxJSONRow[NEXT_ACTION_ID] as string,
      nextActionType: xlsxJSONRow[NEXT_ACTION_TYPE] as NextActionType,
      officeNumbers: xlsxJSONRow[OFFICE_NUMBERS] as Array<string>,
      phoneNumber: xlsxJSONRow[PHONE_NUMBER] as string,
      phoneNumberType: xlsxJSONRow[PHONE_NUMBER_TYPE] as PhoneNumberType,
      transferDestination: xlsxJSONRow[TRANSFER_DESTINATION] as string,
      updateTime: xlsxJSONRow[UPDATE_TIME] as number
    } as PhoneNumber;
  }

  protected postFileReaderProcessing(dynamicPhoneNumbers: Array<PhoneNumber>): Array<PhoneNumber> {
    return dynamicPhoneNumbers;
  }
}