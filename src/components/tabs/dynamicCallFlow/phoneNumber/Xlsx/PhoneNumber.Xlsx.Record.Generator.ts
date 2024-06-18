import { PhoneNumberXlsxRow } from "./PhoneNumber.Xlsx.Interfaces";
import {
  BrandType,
  CallFlowType,
  CallerType,
  ChannelType, LanguageOfferType,
  PhoneNumber,
  PhoneNumberRecordType, PhoneNumberType, UserDestinationType
} from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "../GraphQL/Legacy.PhoneNumber.Interfaces";

import { ActionType } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export class PhoneNumberXlsxRecordGenerator {
  public generatePhoneNumberRecords(phoneNumberXlsxRows: Array<PhoneNumberXlsxRow>): Array<PhoneNumberRecordType> {
    const phoneNumberRecords: Array<PhoneNumberRecordType> = [];

    phoneNumberXlsxRows.forEach((phoneNumberXlsxRow: PhoneNumberXlsxRow) => {
      if (phoneNumberXlsxRow.nextActionId) {
        phoneNumberRecords.push(this.mapToDynamicPhoneNumber(phoneNumberXlsxRow));
      } else {
        phoneNumberRecords.push(this.mapToLegacyPhoneNumber(phoneNumberXlsxRow));
      }
    });

    return phoneNumberRecords;
  }

  private mapToDynamicPhoneNumber(phoneNumberXlsxRow: PhoneNumberXlsxRow): PhoneNumberRecordType {
    const dynamicPhoneNumber: PhoneNumber = {} as PhoneNumber;

    dynamicPhoneNumber.phoneNumber = phoneNumberXlsxRow.dialedPhoneNumber;
    dynamicPhoneNumber.phoneNumberType = phoneNumberXlsxRow.phoneNumberType as PhoneNumberType;
    dynamicPhoneNumber.brand = phoneNumberXlsxRow.brand as BrandType;
    dynamicPhoneNumber.callFlowTemplate = phoneNumberXlsxRow.callFlowTemplate;
    dynamicPhoneNumber.callFlowType = phoneNumberXlsxRow.callFlowType as CallFlowType;
    dynamicPhoneNumber.callTypeDescription = phoneNumberXlsxRow.callTypeDescription;
    dynamicPhoneNumber.channel = phoneNumberXlsxRow.channel as ChannelType;
    dynamicPhoneNumber.dialedDescription = phoneNumberXlsxRow.dialedDescription;
    dynamicPhoneNumber.internetPlacement = phoneNumberXlsxRow.internetPlacement;
    dynamicPhoneNumber.lineOfBusiness = phoneNumberXlsxRow.lineOfBusiness;
    dynamicPhoneNumber.marketingChannel = phoneNumberXlsxRow.marketingChannel;
    dynamicPhoneNumber.predictiveCaller = phoneNumberXlsxRow.predictiveCaller === "TRUE";
    dynamicPhoneNumber.rangeIndicator = phoneNumberXlsxRow.rangeIndicator;
    dynamicPhoneNumber.requestID = phoneNumberXlsxRow.requestID;
    dynamicPhoneNumber.tfnRoutingGroup = phoneNumberXlsxRow.tfnRoutingGroup;
    dynamicPhoneNumber.tollFreeNumber = phoneNumberXlsxRow.tollFreeNumber;
    dynamicPhoneNumber.transferCode = phoneNumberXlsxRow.transferCode;
    dynamicPhoneNumber.whisper = phoneNumberXlsxRow.whisper;
    dynamicPhoneNumber.callerType = phoneNumberXlsxRow.callerType as CallerType;
    dynamicPhoneNumber.callFlowName = phoneNumberXlsxRow.callFlowName;
    dynamicPhoneNumber.callFlowRoute = phoneNumberXlsxRow.callFlowRoute;
    dynamicPhoneNumber.callIntent = phoneNumberXlsxRow.callIntent;
    dynamicPhoneNumber.dataRequests = phoneNumberXlsxRow.dataRequests?.split(",") || [];
    dynamicPhoneNumber.greetingMessages = phoneNumberXlsxRow.greetingMessages;
    dynamicPhoneNumber.languageOffer = phoneNumberXlsxRow.languageOffer as LanguageOfferType;
    dynamicPhoneNumber.nextActionId = phoneNumberXlsxRow.nextActionId;
    dynamicPhoneNumber.nextActionType = phoneNumberXlsxRow.nextActionType as ActionType;
    dynamicPhoneNumber.officeNumbers = phoneNumberXlsxRow.officeNumbers?.split(",") || [];
    dynamicPhoneNumber.transferDestination = phoneNumberXlsxRow.transferDestination;

    return dynamicPhoneNumber;
  }

  private mapToLegacyPhoneNumber(legacyPhoneNumberXlsxRow: PhoneNumberXlsxRow): CctSharedCallFlowDb {
    const legacyPhoneNumber: CctSharedCallFlowDb = { content: {}} as CctSharedCallFlowDb;

    legacyPhoneNumber.pkey = legacyPhoneNumberXlsxRow.dialedPhoneNumber;
    legacyPhoneNumber.dialedDescription = legacyPhoneNumberXlsxRow.dialedDescription;
    legacyPhoneNumber.callFlowTemplate = legacyPhoneNumberXlsxRow.callFlowTemplate;
    legacyPhoneNumber.channel = legacyPhoneNumberXlsxRow.channel as ChannelType;
    legacyPhoneNumber.content.languageOffer = legacyPhoneNumberXlsxRow.languageOffer as LanguageOfferType;
    legacyPhoneNumber.content.dataRequests = legacyPhoneNumberXlsxRow.dataRequests?.split(",") || [];
    legacyPhoneNumber.content.callerType = legacyPhoneNumberXlsxRow.callerType as CallerType;
    legacyPhoneNumber.content.callFlowRoute = legacyPhoneNumberXlsxRow.callFlowRoute;
    legacyPhoneNumber.content.greetingMessages = legacyPhoneNumberXlsxRow.greetingMessages;
    // legacyPhoneNumber.employeeId = legacyPhoneNumberXlsxRow.employeeId; //TODO: this isn't in xlsx file
    legacyPhoneNumber.accountManager = legacyPhoneNumberXlsxRow.accountManager;
    legacyPhoneNumber.affinityVDN = legacyPhoneNumberXlsxRow.affinityVDN;
    legacyPhoneNumber.callTypeDescription = legacyPhoneNumberXlsxRow.callTypeDescription;
    legacyPhoneNumber.transferCode = legacyPhoneNumberXlsxRow.transferCode;
    legacyPhoneNumber.internetPlacement = legacyPhoneNumberXlsxRow.internetPlacement;
    legacyPhoneNumber.callDetails1 = legacyPhoneNumberXlsxRow.callDetails1;
    legacyPhoneNumber.callDetails2 = legacyPhoneNumberXlsxRow.callDetails2;
    legacyPhoneNumber.lineOfBusiness = legacyPhoneNumberXlsxRow.lineOfBusiness;
    legacyPhoneNumber.marketingChannel = legacyPhoneNumberXlsxRow.marketingChannel;
    legacyPhoneNumber.whisper = legacyPhoneNumberXlsxRow.whisper;
    legacyPhoneNumber.requestID = legacyPhoneNumberXlsxRow.requestID;
    legacyPhoneNumber.userDestination = legacyPhoneNumberXlsxRow.userDestination as UserDestinationType;
    legacyPhoneNumber.rangeIndicator = legacyPhoneNumberXlsxRow.rangeIndicator;
    legacyPhoneNumber.content.callIntent = legacyPhoneNumberXlsxRow.callIntent;
    legacyPhoneNumber.content.officeNumbers = legacyPhoneNumberXlsxRow.officeNumbers?.split(",") || [];
    legacyPhoneNumber.predictiveCaller = legacyPhoneNumberXlsxRow.predictiveCaller === "TRUE";
    legacyPhoneNumber.brand = legacyPhoneNumberXlsxRow.brand as BrandType;

    return legacyPhoneNumber;
  }
}