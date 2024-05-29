import {
  AbstractBatchRecordsQuery, BatchRecordQuery, BatchResults
} from "../../../common/GraphQL/AbstractBatchRecords.Query";
import { CctSharedCallFlowDb } from "../LegacyPhoneNumber.Interfaces";

class LegacyPhoneNumberBatchDeleteRecordsQuery extends AbstractBatchRecordsQuery {
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

const legacyPhoneNumberBatchDeleteRecordsQuery = new LegacyPhoneNumberBatchDeleteRecordsQuery();

export const legacyPhoneNumberBatchDeleteRecords: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await legacyPhoneNumberBatchDeleteRecordsQuery.runBatch<CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords);
};