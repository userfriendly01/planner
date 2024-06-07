import {
  PhoneNumberRecordType, PhoneNumber
} from "./Dynamic.PhoneNumber.Interfaces";
import { SingleRecordResults } from "../../common/GraphQL/AbstractSingleRecord.Query";
import { PhoneNumberRecordUtil } from "./PhoneNumber.Record.Util";
import { createLegacyPhoneNumberRecord } from "./Query/Create.Legacy.PhoneNumber.Record.Query";
import { CctSharedCallFlowDb } from "./Legacy.PhoneNumber.Interfaces";
import { createDynamicPhoneNumberRecord } from "./Query/Create.Dynamic.PhoneNumber.Record.Query";
import { deleteLegacyPhoneNumberRecord } from "./Query/Delete.Legacy.PhoneNumber.Record.Query";
import { deleteDynamicPhoneNumberRecord } from "./Query/Delete.Dynamic.PhoneNumber.Record.Query";
import { updateLegacyPhoneNumberRecord } from "./Query/Update.Legacy.PhoneNumber.Record.Query";
import { updateDynamicPhoneNumberRecord } from "./Query/Update.Dynamic.PhoneNumber.Record.Query";

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
      return updateLegacyPhoneNumberRecord(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return updateDynamicPhoneNumberRecord(accessToken, phoneNumberRecord as PhoneNumber);
    }
  }

  static async delete(accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
      return deleteLegacyPhoneNumberRecord(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return deleteDynamicPhoneNumberRecord(accessToken, phoneNumberRecord as PhoneNumber);
    }
  }

}