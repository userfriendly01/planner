import {
  PhoneNumberRecordType, PhoneNumber
} from "../DynamicPhoneNumber.Interfaces";
import { SingleRecordResults } from "../../../../../common/GraphQL/AbstractSingleRecordQuery";
import { PhoneNumberRecordUtil } from "./PhoneNumberRecordUtil";
import { createLegacyPhoneNumberRecord } from "../LegacyPhoneNumberRecordQuery/CreateLegacyPhoneNumberRecordQuery";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";
import { addDynamicPhoneNumberRecord } from "../DynamicPhoneNumberRecordQuery/AddDynamicPhoneNumberRecordQuery";
import { deleteLegacyCallRecordFlow } from "../LegacyPhoneNumberRecordQuery/DeleteLegacyPhoneNumberRecordQuery";
import { deleteDynamicPhoneNumber } from "../DynamicPhoneNumberRecordQuery/DeleteDynamicPhoneNumberQuery";
import {listDynamicPhoneNumberRecords} from "../DynamicPhoneNumberRecordQuery/ListDynamicPhoneNumbersQuery";
import {listLegacyPhoneNumberRecords} from "../LegacyPhoneNumberRecordQuery/ListLegacyPhoneNumberRecordsQuery";
import {updateLegacyPhoneNumberRecord} from "../LegacyPhoneNumberRecordQuery/UpdateLegacyPhoneNumberRecordQuery";
import {updateDynamicPhoneNumber} from "../DynamicPhoneNumberRecordQuery/UpdateDynamicPhoneNumberQuery";

export class SingleCallFlowRecord {

  static async create(accessToken: string, newPhoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(newPhoneNumberRecord)) {
      return createLegacyPhoneNumberRecord(accessToken, newPhoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return addDynamicPhoneNumberRecord(accessToken, newPhoneNumberRecord as PhoneNumber);
    }
  }

  static async update(accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
      return updateLegacyPhoneNumberRecord(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return updateDynamicPhoneNumber(accessToken, phoneNumberRecord as PhoneNumber);
    }
  }

  static async deleteCallFlowRecord(accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
      return deleteLegacyCallRecordFlow(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
    } else {
      return deleteDynamicPhoneNumber(accessToken, phoneNumberRecord as PhoneNumber);
    }
  }

}