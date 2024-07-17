import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { AbstractDataGridFilter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";

export const DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER";

export class PhoneNumberDataGridFilter extends AbstractDataGridFilter<PhoneNumberRecordType> {
  getFilterCacheKey(): string {
    return DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY;
  }

  protected getPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key);
  }
}