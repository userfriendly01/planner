import {
  CallerTypeEnum, CallFlowTypeEnum, LanguageOfferTypeEnum,
  PhoneNumber, PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  CctSharedCallFlowDb, FlowContent
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import {
  CREATE_TIME, DynamicPhoneNumberFormFields, EMPLOYEE_ID,
  PHONE_NUMBER,
  UPDATE_TIME
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  isLegacyContentField,
  LegacyPhoneNumberFormFields,
  PKEY
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import { FieldDataType } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { logger } from "utils/logger";

export const newDynamicPhoneNumberRecord = (): PhoneNumber => {
  return {
    phoneNumber: "",
    brand: undefined,
    callFlowName: "",
    callFlowTemplate: "",
    callFlowType: CallFlowTypeEnum.DTMF,
    callTypeDescription: "",
    channel: undefined,
    employeeId: "",
    callIntent: "",
    callFlowRoute: "",
    callerType: CallerTypeEnum.CUSTOMER,
    dataRequests: [],
    dialedDescription: "",
    greetingMessages: "",
    internetPlacement: "",
    languageOffer: LanguageOfferTypeEnum.ENGLISH,
    lineOfBusiness: "",
    marketingChannel: "",
    nextActionId: "",
    nextActionType: undefined,
    officeNumbers: [],
    phoneNumberType: "",
    predictiveCaller: false,
    rangeIndicator: "",
    requestID: "",
    tfnRoutingGroup: "",
    tollFreeNumber: "",
    transferCode: "",
    transferDestination: "",
    whisper: ""
  };
};

export const newLegacyPhoneNumberRecord = (): CctSharedCallFlowDb => {
  return {
    pkey: "",
    content: {
      callIntent: "",
      callFlowRoute: "",
      callerType: CallerTypeEnum.CUSTOMER,
      dataRequests: [],
      greetingMessages: "",
      languageOffer: LanguageOfferTypeEnum.ENGLISH,
      officeNumbers: [],
      transferDestination: "",
      transferNumber: ""
    } as FlowContent,
    accountManager: "",
    affinityVDN: "",
    agentId: "",
    brand: undefined,
    callDetails1: "",
    callDetails2: "",
    callFlowTemplate: "",
    callTypeDescription: "",
    channel: undefined,
    createTime: "",
    dialedDescription: "",
    employeeId: "",
    internetPlacement: "",
    lineOfBusiness: "",
    marketingChannel: "",
    predictiveCaller: false,
    selfServiceIndicator: undefined,
    rangeIndicator: "",
    requestID: "",
    tfnRoutingGroup: "",
    tollFreeNumber: "",
    transferCode: "",
    type: "",
    userDestination: "",
    whisper: ""
  };
};

export class PhoneNumberRecordUtil {
  public static getPkey(phoneNumberRecord: PhoneNumberRecordType): string {
    return PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord);
  }

  public static getPhoneNumber(phoneNumberRecord: PhoneNumberRecordType): string {
    if (!phoneNumberRecord) {
      return undefined;
    }

    if (this.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
      return (phoneNumberRecord as CctSharedCallFlowDb).pkey;
    } else {
      return (phoneNumberRecord as PhoneNumber).phoneNumber;
    }
  }

  public static setPhoneNumber(phoneNumberRecord: PhoneNumberRecordType, phoneNumber: string): void {
    if (!phoneNumberRecord) {
      return;
    }

    if (this.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
      (phoneNumberRecord as CctSharedCallFlowDb).pkey = phoneNumber;
    } else {
      (phoneNumberRecord as PhoneNumber).phoneNumber = phoneNumber;
    }
  }

  public static filterDynamicPhoneNumberRecords(phoneNumberRecords: Array<PhoneNumberRecordType>): Array<PhoneNumber> {
    return phoneNumberRecords.filter((phoneNumberRecord: PhoneNumberRecordType) => this.isDynamicPhoneNumberRecord(phoneNumberRecord)) as Array<PhoneNumber>;
  }

  public static filterLegacyPhoneNumberRecords(phoneNumberRecords: Array<PhoneNumberRecordType>): Array<CctSharedCallFlowDb> {
    return phoneNumberRecords.filter((phoneNumberRecord: PhoneNumberRecordType) => this.isLegacyPhoneNumberRecord(phoneNumberRecord)) as Array<CctSharedCallFlowDb>;
  }

  public static isDynamicPhoneNumberRecord(phoneNumberRecord: PhoneNumberRecordType): boolean {
    return phoneNumberRecord && PHONE_NUMBER in phoneNumberRecord;
  }

  public static isLegacyPhoneNumberRecord(phoneNumberRecord: PhoneNumberRecordType): boolean {
    return !this.isDynamicPhoneNumberRecord(phoneNumberRecord);
  }

  public static isLegacyContentFieldKey(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    return this.isLegacyPhoneNumberRecord(phoneNumberRecord) && isLegacyContentField(key);
  }

  public static getPropertyArrayValue(phoneNumberRecord: PhoneNumberRecordType, key: string): Array<string> {
    return this.getPropertyValue(phoneNumberRecord, key) as Array<string>;
  }

  public static getPropertyArrayValueAsString(phoneNumberRecord: PhoneNumberRecordType, key: string, delimiter = ", "): string {
    return this.getPropertyArrayValue(phoneNumberRecord, key)?.join(delimiter) || "";
  }

  public static getPropertyStringValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string {
    return this.getPropertyValue(phoneNumberRecord, key) as string;
  }

  public static getPropertyBooleanValue(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    return this.getPropertyValue(phoneNumberRecord, key) as boolean;
  }

  public static getPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): FieldDataType {
    let propertyValue: FieldDataType = undefined;

    if (phoneNumberRecord && key) {
      if (this.isLegacyContentFieldKey(phoneNumberRecord, key)) {
        propertyValue = (phoneNumberRecord as CctSharedCallFlowDb).content ? (phoneNumberRecord as CctSharedCallFlowDb).content[key as keyof FlowContent] : undefined;
      } else {
        propertyValue = phoneNumberRecord[key as keyof typeof phoneNumberRecord];
      }
    }

    return propertyValue;
  }

  public static isValidGreetingMessage(value: string): boolean {
    const reg = new RegExp("^[a-zA-Z0-9,@:=<>./\\-'\" ñáéíóú]+$");
    return value && !reg.test(value);
  }

  public static setArrayPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string, delimiter = ","): void {
    this.setPropertyValue(phoneNumberRecord, key, value.split(delimiter) || []);
  }

  public static setStringValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string): void {
    this.setPropertyValue(phoneNumberRecord, key, value as string);
  }

  public static setNumberValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string): void {
    this.setPropertyValue(phoneNumberRecord, key, Number(value));
  }

  public static setBooleanValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string): void {
    this.setPropertyValue(phoneNumberRecord, key, (value && (value.toLowerCase() === "true" || value.toLowerCase() === "yes" )));
  }

  private static isValidPropertyForPhoneNumberRecordType(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    if (this.isDynamicPhoneNumberRecord(phoneNumberRecord)) {
      return DynamicPhoneNumberFormFields.includes(key);
    } else {
      return LegacyPhoneNumberFormFields.includes(key);
    }
  }

  public static setPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: FieldDataType): void {
    if (!phoneNumberRecord || !key || !value) {
      return;
    }

    // Only set property if it is a valid property for the phoneNumberRecord type
    if (!this.isValidPropertyForPhoneNumberRecordType(phoneNumberRecord, key)) {
      logger.warn(`Invalid property key: ${key} for phoneNumberRecord: ${JSON.stringify(phoneNumberRecord)}`, {});
      delete phoneNumberRecord[key as keyof typeof phoneNumberRecord];
      return;
    }

    if (this.isLegacyContentFieldKey(phoneNumberRecord, key)) {
      if (!(phoneNumberRecord as CctSharedCallFlowDb).content) {
        (phoneNumberRecord as CctSharedCallFlowDb).content = {} as FlowContent;
      }

      // TODO: How to make ts happy trying to dynamically set content property
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (phoneNumberRecord as CctSharedCallFlowDb).content[key] = value;
      return;
    }

    if (key === PKEY && this.isDynamicPhoneNumberRecord(phoneNumberRecord)) {
      (phoneNumberRecord as PhoneNumber)[PHONE_NUMBER] = value as string;
    }

    // const updatedPhoneNumberRecord = {
    //   ...phoneNumberRecord,
    //   [key]: value
    // };
    //
    // return updatedPhoneNumberRecord;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    phoneNumberRecord[key] = value;
  }

  private static setTimeProperty(phoneNumberRecord: PhoneNumberRecordType, key: string): void {
    //TODO: figure out to make ts happy trying to dynamically set a property
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    phoneNumberRecord[key] = this.isLegacyPhoneNumberRecord(phoneNumberRecord) ? new Date().toISOString() : Date.now();
  }

  public static setUpdateTime(phoneNumberRecord: PhoneNumberRecordType): void {
    this.setTimeProperty(phoneNumberRecord, UPDATE_TIME);
  }

  public static setCreateTime(phoneNumberRecord: PhoneNumberRecordType): void {
    this.setTimeProperty(phoneNumberRecord, CREATE_TIME);
  }

  public static batchRemoveTransientProperties(phoneNumberRecords: Array<PhoneNumberRecordType>): void {
    phoneNumberRecords.forEach((phoneNumberRecord: PhoneNumberRecordType) => this.removeTransientProperties(phoneNumberRecord));
  }

  public static removeTransientProperties(phoneNumberRecord: PhoneNumberRecordType): void {
    const validKeys: Array<string> = PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord) ? DynamicPhoneNumberFormFields : LegacyPhoneNumberFormFields;

    Object.keys(phoneNumberRecord).forEach((key: string) => {
      if (key !== "content" && !validKeys.includes(key)) {
        delete phoneNumberRecord[key as keyof typeof phoneNumberRecord];
      }
    });
  }

  public static removeNonNullableKeys(phoneNumberRecord: PhoneNumberRecordType): void {
    if (!phoneNumberRecord[EMPLOYEE_ID as keyof PhoneNumberRecordType]) {
      delete phoneNumberRecord[EMPLOYEE_ID as keyof PhoneNumberRecordType];
    }
  }
}