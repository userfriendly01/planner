import {
  PhoneNumberRecordType, PhoneNumber
} from "./Dynamic.PhoneNumber.Interfaces";
import {
  CREATE_TIME, PHONE_NUMBER, UPDATE_TIME
} from "../Form/Dynamic.PhoneNumber.Form.Fields";
import {
  CctSharedCallFlowDb, FlowContent
} from "./Legacy.PhoneNumber.Interfaces";
import {
  isLegacyContentField, PKEY
} from "../Form/Legacy.PhoneNumber.Form.Fields";
import { FieldDataType } from "../../common/Form/Form.Field.Config";

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

  public static isDynamicPhoneNumberRecord(phoneNumberRecord: PhoneNumberRecordType): boolean {
    return phoneNumberRecord && PHONE_NUMBER in phoneNumberRecord;
  }

  public static isLegacyPhoneNumberRecord(phoneNumberRecord: PhoneNumberRecordType): boolean {
    return !this.isDynamicPhoneNumberRecord(phoneNumberRecord);
  }

  public static isLegacyContentFieldKey(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    return this.isLegacyPhoneNumberRecord(phoneNumberRecord) && isLegacyContentField(key);
  }

  public static getPropertyStringArray(phoneNumberRecord: PhoneNumberRecordType, key: string): Array<string> {
    return this.getPropertyValue(phoneNumberRecord, key) as Array<string>;
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

  public static setPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: FieldDataType): void {
    if (!phoneNumberRecord || !key || !value) {
      return;
    }

    if (this.isLegacyContentFieldKey(phoneNumberRecord, key)) {
      // TODO: How to make ts happy trying to dynamically set a property
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
}