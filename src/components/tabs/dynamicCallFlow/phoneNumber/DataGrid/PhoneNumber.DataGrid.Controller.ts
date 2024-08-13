import { AbstractDataGridController } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Controller";
import {
  PhoneNumber,
  PhoneNumberRecordType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { MatchFilter } from "dynamicCallFlowCommon/Util/Array.Util";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { PHONE_NUMBER } from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";

export const phoneNumberMatchFilter: MatchFilter<PhoneNumberRecordType> = (record1: PhoneNumberRecordType, record2: PhoneNumberRecordType): boolean => {
  if (PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(record1) && PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(record2)) {
    return (record1 as PhoneNumber)[PHONE_NUMBER] === (record2 as PhoneNumber)[PHONE_NUMBER as keyof PhoneNumberRecordType];
  } else if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(record1) && PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(record2)) {
    return (record1 as CctSharedCallFlowDb).pkey === (record2 as CctSharedCallFlowDb).pkey;
  }

  return false;
};

export class PhoneNumberDataGridController extends AbstractDataGridController<PhoneNumberRecordType> {
  matchFilter(): MatchFilter<PhoneNumberRecordType> {
    return phoneNumberMatchFilter;
  }
}