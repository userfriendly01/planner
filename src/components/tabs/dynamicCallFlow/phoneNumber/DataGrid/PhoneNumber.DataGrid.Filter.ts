import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { AbstractDataGridFilter } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Filter";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";

export const DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER";

export class PhoneNumberDataGridFilter extends AbstractDataGridFilter<PhoneNumberRecordType> {
  getFilterCacheKey(): string {
    return DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY;
  }

  protected getPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key);
  }
}