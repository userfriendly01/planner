import { PhoneNumber, PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { SingleRecordResults } from "dynamicCallFlowCommon/GraphQL/AbstractSingleRecord.Query";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import {
  createDynamicPhoneNumberRecord
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Create.Dynamic.PhoneNumber.Record.Query";
import {
  createLegacyPhoneNumberRecord
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Create.Legacy.PhoneNumber.Record.Query";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  updateLegacyPhoneNumberRecord
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Update.Legacy.PhoneNumber.Record.Query";
import {
  updateDynamicPhoneNumberRecord
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Update.Dynamic.PhoneNumber.Record.Query";
import {
  deleteLegacyPhoneNumberRecord
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Delete.Legacy.PhoneNumber.Record.Query";
import {
  deleteDynamicPhoneNumberRecord
} from "dynamicCallFlowPhoneNumber/GraphQL/Query/Delete.Dynamic.PhoneNumber.Record.Query";

export const createPhoneNumberRecord = async (accessToken: string, newPhoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> => {
  if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(newPhoneNumberRecord)) {
    return createLegacyPhoneNumberRecord(accessToken, newPhoneNumberRecord as CctSharedCallFlowDb);
  } else {
    return createDynamicPhoneNumberRecord(accessToken, newPhoneNumberRecord as PhoneNumber);
  }
};

export const updatePhoneNumberRecord = async (accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> => {
  if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
    return updateLegacyPhoneNumberRecord(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
  } else {
    return updateDynamicPhoneNumberRecord(accessToken, phoneNumberRecord as PhoneNumber);
  }
};

export const deletePhoneNumberRecord = async (accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> => {
  if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecord)) {
    return deleteLegacyPhoneNumberRecord(accessToken, phoneNumberRecord as CctSharedCallFlowDb);
  } else {
    return deleteDynamicPhoneNumberRecord(accessToken, phoneNumberRecord as PhoneNumber);
  }
};

export class SingleCallFlowRecord {
  static async create(accessToken: string, newPhoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    return createPhoneNumberRecord(accessToken, newPhoneNumberRecord);
  }

  static async update(accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    return updatePhoneNumberRecord(accessToken, phoneNumberRecord);
  }

  static async delete(accessToken: string, phoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> {
    return deletePhoneNumberRecord(accessToken, phoneNumberRecord);
  }
}