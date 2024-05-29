import {
  PhoneNumberRecordType, PhoneNumber
} from "./DynamicPhoneNumber.Interfaces";
import { SingleRecordResults } from "../../common/GraphQL/AbstractSingleRecord.Query";
import { PhoneNumberRecordUtil } from "./PhoneNumberRecord.Util";
import { legacyPhoneNumberCreateRecord } from "./Query/LegacyPhoneNumberCreateRecord.Query";
import { CctSharedCallFlowDb } from "./LegacyPhoneNumber.Interfaces";
import { dynamicPhoneNumberCreateRecord } from "./Query/DynamicPhoneNumberAddRecord.Query";
import { legacyPhoneNumberDeleteRecord } from "./Query/LegacyPhoneNumberDeleteRecord.Query";
import { dynamicPhoneNumberDeleteRecord } from "./Query/DynamicPhoneNumberDeleteRecord.Query";
import { legacyPhoneNumberUpdateRecord } from "./Query/LegacyPhoneNumberUpdateRecord.Query";
import { dynamicPhoneNumberUpdateRecord } from "./Query/DynamicPhoneNumberUpdateRecord.Query";

export class SingleCallFlowRecord {

  static async create(accessToken: string, newPhoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(newPhoneNumberRecord)) {
      return legacyPhoneNumberCreateRecord(accessToken, newPhoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return dynamicPhoneNumberCreateRecord(accessToken, newPhoneNumberRecord as PhoneNumber);
    }
  }

  static async update(accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
      return legacyPhoneNumberUpdateRecord(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return dynamicPhoneNumberUpdateRecord(accessToken, phoneNumberRecord as PhoneNumber);
    }
  }

  static async deleteCallFlowRecord(accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
      return legacyPhoneNumberDeleteRecord(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return dynamicPhoneNumberDeleteRecord(accessToken, phoneNumberRecord as PhoneNumber);
    }
  }

}