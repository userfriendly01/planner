import {
  CallFlowTypeEnum,
  PhoneNumber, PhoneNumberRecordType,
  PhoneNumberType,
  PhoneNumberTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  CctSharedCallFlowDb, FlowContent
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import {
  DynamicPhoneNumberFormFields, EMPLOYEE_ID,
  PHONE_NUMBER
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  isLegacyContentField,
  LegacyPhoneNumberFormFields,
  PKEY
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import { FieldDataType } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { logger } from "utils/logger";
import { booleanValue } from "dynamicCallFlowCommon/Util/Boolean.Util";

export const newDynamicPhoneNumberRecord = (): PhoneNumber => {
  return {
    phoneNumber: "",
    brand: undefined,
    callFlowName: "",
    callFlowTemplate: "",
    callFlowType: undefined,
    callTypeDescription: "",
    channel: undefined,
    employeeId: "",
    callIntent: "",
    callFlowRoute: "",
    callerType: undefined,
    dataRequests: [],
    dialedDescription: "",
    greetingMessages: "",
    internetPlacement: "",
    languageOffer: undefined,
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
      callerType: undefined,
      dataRequests: [],
      greetingMessages: "",
      languageOffer: undefined,
      officeNumbers: [],
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
  /**
   * Retrieves the primary key (pkey) of a phone number record.  Dynamic phone number records to not have a pkey, so
   * the phone number is used as the primary key.  Both pkey and phoneNumber contain the, uh, phone number.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @returns {string} - The primary key of the phone number record.
   */
  public static getPkey(phoneNumberRecord: PhoneNumberRecordType): string {
    return PhoneNumberRecordUtil.getPhoneNumber(phoneNumberRecord);
  }

  /**
   * Retrieves the phone number from a phone number record.  The key that holds the phone number in the record differs
   * between legacy and dynamic records.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @returns {string} - The phone number.
   */
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

  /**
   * Sets the phone number in a phone number record.  The key that holds the phone number in the record differs
   * between legacy and dynamic records.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} phoneNumber - The phone number to set.
   */
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

  /**
   * Filters dynamic phone number records from a list of phone number records.
   *
   * @param {Array<PhoneNumberRecordType>} phoneNumberRecords - The list of phone number records.
   * @returns {Array<PhoneNumber>} - The filtered list of dynamic phone number records.
   */
  public static filterDynamicPhoneNumberRecords(phoneNumberRecords: Array<PhoneNumberRecordType>): Array<PhoneNumber> {
    return phoneNumberRecords.filter((phoneNumberRecord: PhoneNumberRecordType) => this.isDynamicPhoneNumberRecord(phoneNumberRecord)) as Array<PhoneNumber>;
  }

  /**
   * Filters legacy phone number records from a list of phone number records.
   *
   * @param {Array<PhoneNumberRecordType>} phoneNumberRecords - The list of phone number records.
   * @returns {Array<CctSharedCallFlowDb>} - The filtered list of legacy phone number records.
   */
  public static filterLegacyPhoneNumberRecords(phoneNumberRecords: Array<PhoneNumberRecordType>): Array<CctSharedCallFlowDb> {
    return phoneNumberRecords.filter((phoneNumberRecord: PhoneNumberRecordType) => this.isLegacyPhoneNumberRecord(phoneNumberRecord)) as Array<CctSharedCallFlowDb>;
  }

  /**
   * Checks if a phone number record is a dynamic phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @returns {boolean} - True if the phone number record is dynamic, false otherwise.
   */
  public static isDynamicPhoneNumberRecord(phoneNumberRecord: PhoneNumberRecordType): boolean {
    return phoneNumberRecord && PHONE_NUMBER in phoneNumberRecord;
  }

  /**
   * Checks if a phone number record is a legacy phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @returns {boolean} - True if the phone number record is legacy, false otherwise.
   */
  public static isLegacyPhoneNumberRecord(phoneNumberRecord: PhoneNumberRecordType): boolean {
    return !this.isDynamicPhoneNumberRecord(phoneNumberRecord);
  }

  /**
   * Checks if a key is a legacy content field key for a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key to check.
   * @returns {boolean} - True if the key is a legacy content field key, false otherwise.
   */
  public static isLegacyContentFieldKey(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    return this.isLegacyPhoneNumberRecord(phoneNumberRecord) && isLegacyContentField(key);
  }

  /**
   * Retrieves an array property value from a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @returns {Array<string>} - The array property value.
   */
  public static getPropertyArrayValue(phoneNumberRecord: PhoneNumberRecordType, key: string): Array<string> {
    return this.getPropertyValue(phoneNumberRecord, key) as Array<string>;
  }

  /**
   * Retrieves an array property value as a string from a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @param {string} [delimiter=", "] - The delimiter to use for joining the array elements.
   * @returns {string} - The array property value as a string.
   */
  public static getPropertyArrayValueAsString(phoneNumberRecord: PhoneNumberRecordType, key: string, delimiter = ", "): string {
    return this.getPropertyArrayValue(phoneNumberRecord, key)?.join(delimiter) || "";
  }

  /**
   * Retrieves a string property value from a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @returns {string} - The string property value.
   */
  public static getPropertyStringValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string {
    return this.getPropertyValue(phoneNumberRecord, key) as string;
  }

  /**
   * Retrieves a boolean property value from a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @returns {boolean} - The boolean property value.
   */
  public static getPropertyBooleanValue(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    return this.getPropertyValue(phoneNumberRecord, key) as boolean;
  }

  /**
   * Retrieves a property value from a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @returns {FieldDataType} - The property value.
   */
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

  /**
   * Sets an array property value in a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @param {string} value - The value to set.
   * @param {string} [delimiter=","] - The delimiter to use for splitting the value.
   */
  public static setArrayPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string, delimiter = ","): void {
    this.setPropertyValue(phoneNumberRecord, key, value.split(delimiter) || []);
  }

  /**
   * Sets a string property value in a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @param {string} value - The value to set.
   */
  public static setStringValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string): void {
    this.setPropertyValue(phoneNumberRecord, key, value as string);
  }

  /**
   * Sets a number property value in a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @param {string} value - The value to set.
   */
  public static setNumberValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string): void {
    this.setPropertyValue(phoneNumberRecord, key, Number(value));
  }

  /**
   * Sets a boolean property value in a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @param {string} value - The value to set.
   */
  public static setBooleanValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: string): void {
    this.setPropertyValue(phoneNumberRecord, key, booleanValue(value));
  }

  /**
   * Checks if a property key is valid for a phone number record type.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key to check.
   * @returns {boolean} - True if the key is valid, false otherwise.
   */
  private static isValidPropertyForPhoneNumberRecordType(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    if (this.isDynamicPhoneNumberRecord(phoneNumberRecord)) {
      return DynamicPhoneNumberFormFields.includes(key);
    } else {
      return LegacyPhoneNumberFormFields.includes(key);
    }
  }

  /**
   * Sets a property value in a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   * @param {string} key - The key of the property.
   * @param {FieldDataType} value - The value to set.
   */
  public static setPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: FieldDataType): void {
    if (!phoneNumberRecord || !key) {
      return;
    }

    // Only set property if it is a valid property for the phoneNumberRecord type
    if (key !== PKEY && !this.isValidPropertyForPhoneNumberRecordType(phoneNumberRecord, key)) {
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    phoneNumberRecord[key] = value;
  }

  /**
   * Removes transient properties from a list of phone number records.
   *
   * @param {Array<PhoneNumberRecordType>} phoneNumberRecords - The list of phone number records.
   */
  public static batchRemoveTransientProperties(phoneNumberRecords: Array<PhoneNumberRecordType>): void {
    phoneNumberRecords.forEach((phoneNumberRecord: PhoneNumberRecordType) => this.removeTransientProperties(phoneNumberRecord));
  }

  /**
   * Removes transient properties from a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   */
  public static removeTransientProperties(phoneNumberRecord: PhoneNumberRecordType): void {
    const validKeys: Array<string> = PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord) ? DynamicPhoneNumberFormFields : LegacyPhoneNumberFormFields;

    Object.keys(phoneNumberRecord).forEach((key: string) => {
      if (key !== "content" && !validKeys.includes(key)) {
        delete phoneNumberRecord[key as keyof typeof phoneNumberRecord];
      }
    });
  }

  /**
   * Removes non-nullable keys from a phone number record.
   *
   * @param {PhoneNumberRecordType} phoneNumberRecord - The phone number record.
   */  public static removeNonNullableKeys(phoneNumberRecord: PhoneNumberRecordType): void {
    if (!phoneNumberRecord[EMPLOYEE_ID as keyof PhoneNumberRecordType]) {
      delete phoneNumberRecord[EMPLOYEE_ID as keyof PhoneNumberRecordType];
    }
  }

  /**
   * Converts known properties from one phone number record type to another
   * @param { PhoneNumberRecordType } phoneNumberRecord - phone number record to convert, can be either legacy or dynamic call flow
   * @returns { CctSharedCallFlowDb | PhoneNumber } - converted phone number record
   */
  public static convertPhoneNumberRecord<T extends PhoneNumberRecordType>(phoneNumberRecord: PhoneNumberRecordType): T {
    if (this.isDynamicPhoneNumberRecord(phoneNumberRecord)) {
      return PhoneNumberRecordUtil.convertPhoneNumberToCctSharedCallFlowDb(phoneNumberRecord as PhoneNumber) as T;
    }

    return PhoneNumberRecordUtil.convertCctSharedCallFlowDbToPhoneNumber(phoneNumberRecord as CctSharedCallFlowDb) as T;
  }

  /**
   * Converts known properties from legacy phone number records to dynamic call flow phone number records
   * @param { CctSharedCallFlowDb } phoneNumberRecord - legacy phone number record
   * @returns { PhoneNumber } - dynamic call flow phone number record
   */
  private static convertCctSharedCallFlowDbToPhoneNumber (phoneNumberRecord: CctSharedCallFlowDb): PhoneNumber {
    return {
      brand: phoneNumberRecord.brand,
      callerType: phoneNumberRecord.content?.callerType,
      callFlowName: "",
      callFlowTemplate: phoneNumberRecord.callFlowTemplate,
      callFlowType: phoneNumberRecord.selfServiceIndicator === true ? CallFlowTypeEnum.SELFSERVICE : CallFlowTypeEnum.DTMF,
      callFlowRoute: phoneNumberRecord.content.callFlowRoute,
      callIntent: phoneNumberRecord.content.callIntent,
      callTypeDescription: phoneNumberRecord.callTypeDescription,
      channel: phoneNumberRecord.channel,
      createTime: Math.floor((phoneNumberRecord.createTime ? new Date(phoneNumberRecord.createTime) : new Date()).getTime() / 1000),
      dataRequests: phoneNumberRecord.content.dataRequests,
      dialedDescription: phoneNumberRecord.dialedDescription,
      employeeId: phoneNumberRecord.employeeId,
      greetingMessages: phoneNumberRecord.content.greetingMessages,
      internetPlacement: phoneNumberRecord.internetPlacement,
      languageOffer: phoneNumberRecord.content.languageOffer,
      lineOfBusiness: phoneNumberRecord.lineOfBusiness,
      marketingChannel: phoneNumberRecord.marketingChannel,
      officeNumbers: phoneNumberRecord.content.officeNumbers,
      phoneNumber: phoneNumberRecord.pkey,
      phoneNumberType: Object.values(PhoneNumberTypeEnum).includes(phoneNumberRecord.type as PhoneNumberTypeEnum) ? phoneNumberRecord.type as PhoneNumberType : PhoneNumberTypeEnum.DID,
      predictiveCaller: phoneNumberRecord.predictiveCaller,
      rangeIndicator: phoneNumberRecord.rangeIndicator,
      requestID: phoneNumberRecord.requestID,
      tollFreeNumber: phoneNumberRecord.tollFreeNumber,
      tfnRoutingGroup: phoneNumberRecord.tfnRoutingGroup,
      transferCode: phoneNumberRecord.transferCode,
      transferDestination: phoneNumberRecord.userDestination,
      updateTime: Math.floor((phoneNumberRecord.updateTime ? new Date(phoneNumberRecord.updateTime) : new Date()).getTime() / 1000),
      whisper: phoneNumberRecord.whisper
    };
  }

  /**
   * Converts known properties from dynamic phone number record to legacy flow phone number records
   * @param { PhoneNumber } phoneNumberRecord - dynamic call flow phone number record
   * @returns { CctSharedCallFlowDb } - legacy phone number record
   */
  private static convertPhoneNumberToCctSharedCallFlowDb (phoneNumberRecord: PhoneNumber): CctSharedCallFlowDb {
    return {
      accountManager: "",
      affinityVDN: "",
      agentId: "",
      brand: phoneNumberRecord.brand,
      callDetails1: "",
      callDetails2: "",
      callFlowTemplate: phoneNumberRecord.callFlowTemplate,
      callTypeDescription: phoneNumberRecord.callTypeDescription,
      channel: phoneNumberRecord.channel,
      content: {
        callIntent: phoneNumberRecord.callIntent,
        callerType: phoneNumberRecord.callerType,
        callFlowRoute: phoneNumberRecord.callFlowRoute,
        dataRequests: phoneNumberRecord.dataRequests,
        greetingMessages: phoneNumberRecord.greetingMessages,
        languageOffer: phoneNumberRecord.languageOffer,
        transferNumber: "",
        officeNumbers: phoneNumberRecord.officeNumbers
      },
      createTime: (phoneNumberRecord.createTime ? new Date(phoneNumberRecord.createTime) : new Date()).toISOString(),
      dialedDescription: phoneNumberRecord.dialedDescription,
      employeeId: phoneNumberRecord.employeeId,
      internetPlacement: phoneNumberRecord.internetPlacement,
      lineOfBusiness: phoneNumberRecord.lineOfBusiness,
      marketingChannel: phoneNumberRecord.marketingChannel,
      pkey: phoneNumberRecord.phoneNumber,
      predictiveCaller: phoneNumberRecord.predictiveCaller,
      rangeIndicator: phoneNumberRecord.rangeIndicator,
      requestID: phoneNumberRecord.requestID,
      selfServiceIndicator: phoneNumberRecord.callFlowType === CallFlowTypeEnum.SELFSERVICE,
      tfnRoutingGroup: phoneNumberRecord.tfnRoutingGroup,
      tollFreeNumber: phoneNumberRecord.tollFreeNumber,
      transferCode: phoneNumberRecord.transferCode,
      type: phoneNumberRecord.phoneNumberType,
      updateTime: (phoneNumberRecord.updateTime ? new Date(phoneNumberRecord.updateTime) : new Date()).toISOString(),
      userDestination: phoneNumberRecord.transferDestination,
      whisper: phoneNumberRecord.whisper
    };
  }
}
