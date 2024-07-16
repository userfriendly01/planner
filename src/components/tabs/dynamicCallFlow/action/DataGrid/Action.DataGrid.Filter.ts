import { AbstractDataGridFilter } from "dynamicCallFlowCommon/DataGrid/Abstract.DataGrid.Filter";
import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { ActionRecordUtil } from "dynamicCallFlowAction/GraphQL/Action.Record.Util";

export const DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY = "DYNAMIC_CALL_FLOW_ACTION_FILTER";


export class ActionDataGridFilter extends AbstractDataGridFilter<ActionRecordType> {
  getFilterCacheKey(): string {
    return DYNAMIC_CALL_FLOW_ACTION_FILTER_CACHE_KEY;
  }

  protected getPropertyValue(actionRecord: ActionRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return ActionRecordUtil.getPropertyValue(actionRecord, key);
  }
}