import { AbstractDataGridComponentManager } from "../../common/DataGrid/Abstract.DataGrid.Component.Manager";
import { ActionRecordType } from "../GraphQL/DynamicCallFlowActionGraphQL.Interfaces";
import { actionListRecords } from "../GraphQL/ListActionRecordsQuery";

export class ActionDataGridManager extends AbstractDataGridComponentManager<ActionRecordType> {
  protected async retrieveData(accessToken: string): Promise<Array<ActionRecordType>> {
    return await actionListRecords(accessToken);
  }

  protected getPropertyValue(actionRecord: ActionRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return actionRecord[key as keyof ActionRecordType];
  }

  getFilterCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_ACTION_SEARCH_FILTER";
  }

  getMasterDataCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_ACTION_MASTER_DATA";
  }

  protected getMasterDataFieldNames(): Array<string> {
    return ["actionId", "actionType", "callFlowName", "createTime", "updateTime", "speech","timeout","finishOnKey","minDigits","maxDigits","nextActionType","nextActionId","options","repeat"];
  }

  protected getMasterDataItemsWithList(): Array<string> {
    return [];
  }
}