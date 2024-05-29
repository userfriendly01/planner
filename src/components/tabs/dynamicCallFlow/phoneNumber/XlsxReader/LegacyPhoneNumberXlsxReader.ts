import {
  AbstractXlsxReader, XlsxJSONRow
} from "../../common/XlsxReader/AbstractXlsxReader";
import { CctSharedCallFlowDb } from "../GraphQL/LegacyPhoneNumber.Interfaces";
import {
  ACCOUNT_MANAGER,
  AFFINITY_VDN,
  AGENT_ID,
  CALL_DETAILS_1,
  CALL_DETAILS_2,
  PKEY,
  SELF_SERVICE_INDICATOR,
  TRANSFER_NUMBER,
  TYPE,
  USER_DESTINATION
} from "../Form/LegacyPhoneNumberForm.Fields";
import {
  BrandType, CallerType, ChannelType, LanguageOfferType
} from "../GraphQL/DynamicPhoneNumber.Interfaces";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
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
} from "../Form/DynamicPhoneNumberForm.Fields";

class LegacyPhoneNumberXlsxReader extends AbstractXlsxReader<CctSharedCallFlowDb> {
  protected mapXlsxJSONRowToRecord(xlsxJSONRow: XlsxJSONRow): CctSharedCallFlowDb {
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
      accountManager: xlsxJSONRow[ACCOUNT_MANAGER] as string,
      affinityVDN: xlsxJSONRow[AFFINITY_VDN] as string,
      agentId: xlsxJSONRow[AGENT_ID] as string,
      callDetails1: xlsxJSONRow[CALL_DETAILS_1] as string,
      callDetails2: xlsxJSONRow[CALL_DETAILS_2] as string,
      pkey: xlsxJSONRow[PKEY] as string,
      selfServiceIndicator: xlsxJSONRow[SELF_SERVICE_INDICATOR] as boolean,
      transferNumber: xlsxJSONRow[TRANSFER_NUMBER] as string,
      type: xlsxJSONRow[TYPE] as string,
      userDestination: xlsxJSONRow[USER_DESTINATION] as string,
      content: {
        callFlowRoute: xlsxJSONRow[CALL_FLOW_ROUTE] as string,
        callIntent: xlsxJSONRow[CALL_INTENT] as string,
        callerType: xlsxJSONRow[CALLER_TYPE] as CallerType,
        dataRequests: xlsxJSONRow[DATA_REQUESTS] as Array<string>,
        greetingMessages: xlsxJSONRow[GREETING_MESSAGES] as string,
        languageOffer: xlsxJSONRow[LANGUAGE_OFFER] as LanguageOfferType,
        officeNumbers: xlsxJSONRow[OFFICE_NUMBERS] as Array<string>
      }
    } as CctSharedCallFlowDb;
  }

  protected postFileReaderProcessing(legacyPhoneNumbers: Array<CctSharedCallFlowDb>): Array<CctSharedCallFlowDb> {
    let result: string;
    const keys: Array<string> = ["a", "b", "c"];
    result = "";
    result += keys.join(",") + "\n";
    // result += "\n";
    return legacyPhoneNumbers;
  }
}