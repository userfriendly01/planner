import {
  PhoneNumberRecordType, PhoneNumber
} from "./Dynamic.PhoneNumber.Interfaces";
import { SingleRecordResults } from "../../common/GraphQL/AbstractSingleRecord.Query";
import { PhoneNumberRecordUtil } from "./PhoneNumber.Record.Util";
import { createLegacyPhoneNumberRecord } from "./Query/Create.Legacy.PhoneNumber.Record.Query";
import { CctSharedCallFlowDb } from "./Legacy.PhoneNumber.Interfaces";
import { createDynamicPhoneNumberRecord } from "./Query/Create.Dynamic.PhoneNumber.Record.Query";
import { legacyPhoneNumberDeleteRecord } from "./Query/Delete.Legacy.PhoneNumber.Record.Query";
import { deleteDynamicPhoneNumberRecord } from "./Query/Delete.Dynamic.PhoneNumber.Record.Query";
import { legacyPhoneNumberUpdateRecord } from "./Query/Update.Legacy.PhoneNumber.Record.Query";
import { dynamicPhoneNumberUpdateRecord } from "./Query/Update.Dynamic.PhoneNumber.Record.Query";

export class SingleCallFlowRecord {

  static async create(accessToken: string, newPhoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(newPhoneNumberRecord)) {
      return createLegacyPhoneNumberRecord(accessToken, newPhoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return createDynamicPhoneNumberRecord(accessToken, newPhoneNumberRecord as PhoneNumber);
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
      return deleteDynamicPhoneNumberRecord(accessToken, phoneNumberRecord as PhoneNumber);
    }
  }

}