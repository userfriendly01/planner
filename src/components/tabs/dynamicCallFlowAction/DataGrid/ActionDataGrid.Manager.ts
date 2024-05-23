import { AbstractDataGridManager } from "../../../../common/DataGrid/AbstractDataGrid.Manager";
import { ActionRecordType } from "../GraphQL/DynamicCallFlowActionGraphQL.Interfaces";
import { listActionRecords } from "../GraphQL/ListActionRecordsQuery";

export class ActionDataGridManager extends AbstractDataGridManager<ActionRecordType> {
  protected async retrieveData(accessToken: string): Promise<Array<ActionRecordType>> {
    return await listActionRecords(accessToken);
  }

  protected getPropertyValue(actionRecord: ActionRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return actionRecord[key as keyof ActionRecordType];
  }

  protected getFilterCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_ACTION_SEARCH_FILTER";
  }

  protected getMasterDataCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_ACTION_MASTER_DATA";
  }

  protected getMasterDataItems(): Array<string> {
    return ["actionId", "actionType", "callFlowName", "createTime", "updateTime", "speech","timeout","finishOnKey","minDigits","maxDigits","nextActionType","nextActionId","options","repeat"];
  }

  protected getMasterDataItemsWithList(): Array<string> {
    return [];
  }
}