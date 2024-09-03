import { AbstractDataGridFilter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import { ActionRecordType } from "components/tabs/dynamicCallFlow/action//GraphQL/Action.Interfaces";
import { ActionRecordUtil } from "components/tabs/dynamicCallFlow/action//GraphQL/Action.Record.Util";

export const DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_ACTION_FILTER";

export class ActionDataGridFilter extends AbstractDataGridFilter<ActionRecordType> {
  getFilterCacheKey(): string {
    return DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY;
  }

  getPropertyValue(actionRecord: ActionRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return ActionRecordUtil.getPropertyValue(actionRecord, key);
  }
}