import {
  ActionRecordType,
  ActionTypeEnum,
  Announcement,
  Menu,
  MenuOptions, Redirect
} from "./Action.Interfaces";
import {
  AbstractGraphQLQuery, GraphQLResponse
} from "../../common/GraphQL/AbstractGraphQL.Query";
import {
  AbstractBatchRecordsQuery,
  BatchGraphQLResponse,
  BatchResults
} from "../../common/GraphQL/Abstract.BatchRecords.Query";

class BatchDeleteActionRecordsQuery extends AbstractBatchRecordsQuery<string, ActionRecordType>{
  protected batchInputName(): string {
    return "batchActionInput";
  }

  protected queryName(): string {
    return "deleteCallFlowConfig";
  }

  protected queryDefinition(): string {
    return `
      mutation deleteCallFlowConfig($input: CallFlowConfigInput! ) {
        createCallFlowConfig(input: $input) {
            callFlowName
          }
        }`;
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
  return await batchCreateDynamicActionQuery.runBatch(accessToken, actionRecords.map(actionRecord => actionRecord.actionId));
}