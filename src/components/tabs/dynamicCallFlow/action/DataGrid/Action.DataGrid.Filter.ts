import { AbstractDataGridFilter } from "../../common/DataGrid/Abstract.DataGrid.Filter";
import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import { ActionRecordUtil } from "../GraphQL/Action.Record.Util";

export const DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_ACTION_FILTER";


export class ActionDataGridFilter extends AbstractDataGridFilter<ActionRecordType> {
  getFilterCacheKey(): string {
    return DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY;
  }

  protected getPropertyValue(actionRecord: ActionRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return ActionRecordUtil.getPropertyValue(actionRecord, key);
  }
}