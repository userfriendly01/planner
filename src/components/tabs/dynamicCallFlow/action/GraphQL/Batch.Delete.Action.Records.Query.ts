import { ActionRecordType } from "components/tabs/dynamicCallFlow/action/GraphQL/Action.Interfaces";
import { BatchResults } from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { CallFlowDeleteInput } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import {
  AbstractBatchDeleteDynamicCallFlowQuery
} from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.Batch.Delete.DynamicCallFlow.Query";

class BatchDeleteActionRecordsQuery extends AbstractBatchDeleteDynamicCallFlowQuery<ActionRecordType> {
  protected generateCallFlowDeleteInputs(actionRecords: Array<ActionRecordType>): Array<CallFlowDeleteInput> {
    return actionRecords.map( actionRecord =>
      ({
        id: actionRecord.actionId,
        actionType: actionRecord.actionType
      } as CallFlowDeleteInput));
  }
}

const batchCreateDynamicActionQuery = new BatchDeleteActionRecordsQuery();

/**
 * This method simply calls the BatchDeleteActionRecordsQuery.runBatch.  It is here in case any common manipulation of the action
 * records occur, they can be done here rather than all over the application.  As of now, it appears it isn't necessary.
 * @param {string} accessToken
 * @param {Array<ActionRecordType>} actionRecords
 * @return {Promise<BatchResults<ActionRecordType>>}
 */
export async function batchDeleteDynamicActionRecords(accessToken: string, actionRecords: Array<ActionRecordType>): Promise<BatchResults<ActionRecordType>> {
  return await batchCreateDynamicActionQuery.batchQuery(accessToken, actionRecords);
}