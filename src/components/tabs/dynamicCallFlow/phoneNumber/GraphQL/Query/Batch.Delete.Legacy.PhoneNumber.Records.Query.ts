import {
  AbstractBatchRecordsQuery, BatchRecordQuery, BatchResults
} from "../../../common/GraphQL/Abstract.BatchRecords.Query";
import { CctSharedCallFlowDb } from "../Legacy.PhoneNumber.Interfaces";

class BatchDeleteLegacyPhoneNumberRecordsQuery extends AbstractBatchRecordsQuery<string, CctSharedCallFlowDb> {
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

const batchDeleteLegacyPhoneNumberRecordsQuery = new BatchDeleteLegacyPhoneNumberRecordsQuery();

export const batchDeleteLegacyPhoneNumberRecords: BatchRecordQuery<CctSharedCallFlowDb> = async (accessToken: string, legacyPhoneNumberRecords: Array<CctSharedCallFlowDb>): Promise<BatchResults<CctSharedCallFlowDb>> => {
  return await batchDeleteLegacyPhoneNumberRecordsQuery.runBatch(accessToken, legacyPhoneNumberRecords.map((legacyPhoneNumberRecord: CctSharedCallFlowDb) => legacyPhoneNumberRecord.pkey));
};