import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  generateMatchingRecordMessages,
  pkeyAndEmployeeIdFilter
} from "../GraphQL/Match.PhoneNumber.Records.Util";
import { BatchPhoneNumberRecord } from "../GraphQL/Batch.PhoneNumber.Records.Util";
import { deleteOppositeRows } from "../DataGrid/PhoneNumber.DataGrid.Util";
import {
  AbstractPreviewModalHandler, DataGridAction
} from "../../common/Preview/Abstract.Preview.Modal.Handler";
import {
  BatchRecordQuery, BatchResults
} from "../../common/GraphQL/Abstract.BatchRecords.Query";

export class PhoneNumberPreviewModalHandler extends AbstractPreviewModalHandler<PhoneNumberRecordType> {
  private hasMatchingRecords(recordsToMatchOn: Array<PhoneNumberRecordType>): boolean {
    const matchingRecordMessages = generateMatchingRecordMessages(this.dataGridController.sourceRecords, recordsToMatchOn, pkeyAndEmployeeIdFilter);

    if (matchingRecordMessages && matchingRecordMessages.length > 0) {
      this.dataGridController.alertBarController.error(matchingRecordMessages.join("\n"));
      return true;
    }

    return false;
  }

  async handleOnCreate(accessToken: string, recordsToCreate: Array<PhoneNumberRecordType>): Promise<void> {
    if (this.hasMatchingRecords(recordsToCreate)) {
      return;
    }

    await this.runPhoneNumberBatch(accessToken, recordsToCreate, BatchPhoneNumberRecord.create,
      this.dataGridController.addRecordsToSourceRecords);
  }

  async handleOnUpdate(accessToken: string, recordsToUpdate: Array<PhoneNumberRecordType>): Promise<void> {
    if (this.hasMatchingRecords(recordsToUpdate)) {
      return;
    }

    await this.runPhoneNumberBatch(accessToken, recordsToUpdate, BatchPhoneNumberRecord.update,
      this.dataGridController.updateRecordsInSourceRecords);
  }

  async handleOnDelete(accessToken: string, recordsToDelete: Array<PhoneNumberRecordType>): Promise<void> {
    await this.runPhoneNumberBatch(accessToken, recordsToDelete, BatchPhoneNumberRecord.delete,
      this.dataGridController.removeRecordsFromSourceRecords);
  }

  async runPhoneNumberBatch(accessToken: string, records: Array<PhoneNumberRecordType>,
    batchRecordQuery: BatchRecordQuery<PhoneNumberRecordType>,
    dataGridAction: DataGridAction<PhoneNumberRecordType>): Promise<BatchResults<PhoneNumberRecordType>> {

    const batchResults = await this.runBatch(accessToken, records, batchRecordQuery, dataGridAction);

    if (batchResults?.hasError) {
      return;
    }

    await deleteOppositeRows(accessToken, batchResults.success);
  }
}