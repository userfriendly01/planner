import { ActionRecordType } from "dynamicCallFlowAction/GraphQL/Action.Interfaces";
import { BatchResults } from "dynamicCallFlowCommon/GraphQL/Abstract.BatchRecords.Query";
import { CallFlowDeleteInput } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import {
  AbstractBatchDeleteDynamicCallFlowQuery
} from "dynamicCallFlowCommon/GraphQL/Batch.Delete.DynamicCallFlow.Query";

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