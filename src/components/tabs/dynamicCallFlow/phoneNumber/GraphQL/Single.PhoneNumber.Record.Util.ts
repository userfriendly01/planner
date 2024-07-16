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

export const createPhoneNumberRecord = async (accessToken: string, phoneNumberRecordToBeCreated: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> => {
  PhoneNumberRecordUtil.removeTransientProperties(phoneNumberRecordToBeCreated);

  if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecordToBeCreated)) {
    return createLegacyPhoneNumberRecord(accessToken, phoneNumberRecordToBeCreated as CctSharedCallFlowDb);
  } else {
    return createDynamicPhoneNumberRecord(accessToken, phoneNumberRecordToBeCreated as PhoneNumber);
  }
};

export const updatePhoneNumberRecord = async (accessToken: string, updatedPhoneNumberRecord: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> => {
  PhoneNumberRecordUtil.removeTransientProperties(updatedPhoneNumberRecord);

  if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(updatedPhoneNumberRecord)) {
    return updateLegacyPhoneNumberRecord(accessToken, updatedPhoneNumberRecord as CctSharedCallFlowDb);
  } else {
    return updateDynamicPhoneNumberRecord(accessToken, updatedPhoneNumberRecord as PhoneNumber);
  }
};

export const deletePhoneNumberRecord = async (accessToken: string, phoneNumberRecordToDelete: PhoneNumberRecordType): Promise<SingleRecordResults<PhoneNumberRecordType>> => {
  if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(phoneNumberRecordToDelete)) {
    return deleteLegacyPhoneNumberRecord(accessToken, phoneNumberRecordToDelete as CctSharedCallFlowDb);
  } else {
    return deleteDynamicPhoneNumberRecord(accessToken, phoneNumberRecordToDelete as PhoneNumber);
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