import {
  AbstractBatchQuery, BatchRecordQuery, BatchResults
} from "../../../../../common/GraphQL/AbstractBatchQuery";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

class BatchDeleteLegacyPhoneNumberRecordQuery extends AbstractBatchQuery {
  protected batchInputName(): string {
    return "pkey";
  }

  protected queryName(): string {
    return "batchDeleteCctSharedCallFlowDb";
  }

  protected queryDefinition(): string {
    return `
      mutation ${this.queryName()}($input: CctSharedCallFlowDbBatchDelInput!) {
          ${this.queryName()}(input: $input) {
            items {
              pkey
            }
          }
        }`;
  }
}

const batchDeleteLegacyPhoneNumberRecordQuery = new BatchDeleteLegacyPhoneNumberRecordQuery();

export const batchDeleteLegacyPhoneNumberRecord: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await batchDeleteLegacyPhoneNumberRecordQuery.runBatch<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords);
};