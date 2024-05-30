import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { AbstractDataGridFilterModalManager } from "../../common/DataGrid/Abstract.DataGrid.Filter.Modal.Manager";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumber.Record.Util";

const DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER";

export class PhoneNumberDataGridFilterModalManager extends AbstractDataGridFilterModalManager<PhoneNumberRecordType> {
  getFilterCacheKey(): string {
    return DYNAMIC_CALL_FLOW_PHONE_NUMBER_FILTER_CACHE_KEY;
  }

  protected getPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key);
  }

}