import {
  PhoneNumberRecordType, PhoneNumber
} from "./DynamicPhoneNumber.Interfaces";
import {
  CREATE_TIME,
  PHONE_NUMBER, UPDATE_TIME

} from "../Form/DynamicPhoneNumberForm.Fields";
import {
  CctSharedCallFlowDb, FlowContent
} from "./LegacyPhoneNumber.Interfaces";
import { isLegacyContentField } from "../Form/LegacyPhoneNumberForm.Fields";
import { FieldDataType } from "../../common/Form/FormFieldConfig.State";

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
    return PHONE_NUMBER in phoneNumberRecord;
  }

  public static isLegacyPhoneNumberRecord(phoneNumberRecord: PhoneNumberRecordType): boolean {
    return !this.isDynamicPhoneNumberRecord(phoneNumberRecord);
  }

  public static isLegacyContentFieldKey(phoneNumberRecord: PhoneNumberRecordType, key: string): boolean {
    return this.isLegacyPhoneNumberRecord(phoneNumberRecord) && isLegacyContentField(key);
  }

  public static getPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): FieldDataType {
    if (!phoneNumberRecord || !key) {
      return undefined;
    }

    if (this.isLegacyContentFieldKey(phoneNumberRecord, key)) {
      return (phoneNumberRecord as CctSharedCallFlowDb).content ? (phoneNumberRecord as CctSharedCallFlowDb).content[key as keyof FlowContent] : undefined;
    }

    return phoneNumberRecord[key as keyof typeof phoneNumberRecord];
  }

  public static isValidGreetingMessage(value: string): boolean {
    const reg = new RegExp("^[a-zA-Z0-9,@:=<>./\\-\\'\" ñáéíóú]+$");
    return value && !reg.test(value);
  }

  public static setPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string, value: FieldDataType): PhoneNumberRecordType {
    if (!phoneNumberRecord || !key || !value) {
      return;
    }

    if (this.isLegacyContentFieldKey(phoneNumberRecord, key)) {
      // TODO: How to make ts happy trying to dynamically set a property
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return {
        ...phoneNumberRecord,
        content: {
          ...phoneNumberRecord["content" as keyof typeof phoneNumberRecord] as FlowContent || {},
          [key]: value
        }
      };
    }

    // const updatedPhoneNumberRecord = {
    //   ...phoneNumberRecord,
    //   [key]: value
    // };
    //
    // return updatedPhoneNumberRecord;
    return {
      ...phoneNumberRecord,
      [key]: value
    };
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