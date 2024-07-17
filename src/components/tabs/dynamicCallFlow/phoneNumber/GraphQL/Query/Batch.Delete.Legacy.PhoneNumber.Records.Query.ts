import {
  AbstractBatchRecordsQuery, BatchRecordQuery, BatchResults
} from "components/tabs/dynamicCallFlow/common/GraphQL/Abstract.BatchRecords.Query";
import { CctSharedCallFlowDb } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";


class BatchDeleteLegacyPhoneNumberRecordsQuery extends AbstractBatchRecordsQuery {
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
  return await batchDeleteLegacyPhoneNumberRecordsQuery.runBatch<string, CctSharedCallFlowDb>(accessToken, legacyPhoneNumberRecords.map((legacyPhoneNumberRecord: CctSharedCallFlowDb) => legacyPhoneNumberRecord.pkey));
};