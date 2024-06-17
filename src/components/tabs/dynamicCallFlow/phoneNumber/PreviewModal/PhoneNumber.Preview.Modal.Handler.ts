import {
  CallFlowDeleteResponse, PhoneNumberRecordType
} from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  generateMatchingRecordMessages,
  pkeyAndEmployeeIdFilter
} from "../GraphQL/Match.PhoneNumber.Records.Util";
import { BatchPhoneNumberRecord } from "../GraphQL/Batch.PhoneNumber.Records.Util";
import { deleteOppositeRows } from "../DataGrid/PhoneNumber.DataGrid.Util";
import {
  AbstractPreviewModalHandler, DataGridAction, HANDLED_SUCCESSFULLY, HANDLED_UNSUCCESSFULLY
} from "../../common/Preview/Abstract.Preview.Modal.Handler";
import {
  BatchRecordQuery, BatchResults
} from "../../common/GraphQL/Abstract.BatchRecords.Query";

export class PhoneNumberPreviewModalHandler extends AbstractPreviewModalHandler<PhoneNumberRecordType, CallFlowDeleteResponse> {
  private hasMatchingRecords(recordsToMatchOn: Array<PhoneNumberRecordType>): boolean {
    const matchingRecordMessages = generateMatchingRecordMessages(this.dataGridController.sourceRecords, recordsToMatchOn, pkeyAndEmployeeIdFilter);

    if (matchingRecordMessages && matchingRecordMessages.length > 0) {
      this.dataGridController.alertBarController.error(matchingRecordMessages.join("\n"));
      return true;
    }

    return false;
  }

  async handleOnCreate(accessToken: string, recordsToCreate: Array<PhoneNumberRecordType>): Promise<boolean> {
    if (this.hasMatchingRecords(recordsToCreate)) {
      return HANDLED_UNSUCCESSFULLY;
    }

    const batchResults = await this.runPhoneNumberBatch(accessToken, recordsToCreate, BatchPhoneNumberRecord.create,
      this.dataGridController.addRecordsToSourceRecords);

    return batchResults?.hasError ? HANDLED_UNSUCCESSFULLY : HANDLED_SUCCESSFULLY;
  }

  async handleOnUpdate(accessToken: string, recordsToUpdate: Array<PhoneNumberRecordType>): Promise<boolean> {
    if (this.hasMatchingRecords(recordsToUpdate)) {
      return HANDLED_UNSUCCESSFULLY;
    }

    const batchResults = await this.runPhoneNumberBatch(accessToken, recordsToUpdate, BatchPhoneNumberRecord.update,
      this.dataGridController.updateRecordsInSourceRecords);

    return batchResults?.hasError ? HANDLED_UNSUCCESSFULLY : HANDLED_SUCCESSFULLY;
  }

  async handleOnDelete(accessToken: string, recordsToDelete: Array<PhoneNumberRecordType>): Promise<boolean> {
    const batchResults = await this.runPhoneNumberBatch(accessToken, recordsToDelete, BatchPhoneNumberRecord.delete,
      this.dataGridController.removeRecordsFromSourceRecords);

    return batchResults?.hasError ? HANDLED_UNSUCCESSFULLY : HANDLED_SUCCESSFULLY;
  }

  async runPhoneNumberBatch(accessToken: string, records: Array<PhoneNumberRecordType>,
    batchRecordQuery: BatchRecordQuery<PhoneNumberRecordType>,
    dataGridAction: DataGridAction<PhoneNumberRecordType>): Promise<BatchResults<PhoneNumberRecordType>> {

    const batchResults = await this.runBatch(accessToken, records, batchRecordQuery, dataGridAction);

    if (!batchResults?.hasError) {
      await deleteOppositeRows(accessToken, batchResults.success);
    }

    return batchResults;
  }
}