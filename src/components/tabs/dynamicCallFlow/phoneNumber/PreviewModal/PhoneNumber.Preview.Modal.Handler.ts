// export interface DataGridController<RecordType> {
//   set
// }
import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  generateMatchingRecordMessages,
  pkeyAndEmployeeIdFilter,
  pkeyFilter
} from "../GraphQL/Match.PhoneNumber.Records.Util";
import { BatchPhoneNumberRecord } from "../GraphQL/Batch.PhoneNumber.Records.Util";
import { deleteOppositeRows } from "../DataGrid/PhoneNumber.DataGrid.Util";
import { DataGridControllerRef } from "../../common/Container.Interfaces";
import { DataGridController } from "../../common/DataGrid/Abstract.DataGrid.Controller";

export interface HandlerResponse {
  errorMessage?: string;
  successMessage?: string;
}

export class PhoneNumberPreviewModalHandler {
  private readonly _dataGridController: DataGridControllerRef<PhoneNumberRecordType>;

  constructor(dataGridController: DataGridControllerRef<PhoneNumberRecordType>) {
    this._dataGridController = dataGridController;
  }

  private get dataGridController(): DataGridController<PhoneNumberRecordType> {
    return this._dataGridController.current;
  }

  async handleOnCreate(accessToken: string, recordsToCreate: Array<PhoneNumberRecordType>): Promise<void> {
    const matchingRecordMessages = generateMatchingRecordMessages(this.dataGridController.sourceRecords, recordsToCreate, pkeyAndEmployeeIdFilter);

    if (matchingRecordMessages && matchingRecordMessages.length > 0) {
      this.dataGridController.alertBarController.error(matchingRecordMessages.join("\n"));
      return;
    }

    const batchResults = await BatchPhoneNumberRecord.create(accessToken, recordsToCreate);

    if (batchResults?.hasError) {
      this.dataGridController.alertBarController.error(batchResults.alertMsg);
    }

    await deleteOppositeRows(accessToken, batchResults.success);

    this.dataGridController.addRecordsToSourceRecords(batchResults.success);
    this.dataGridController.setSelectedRecordsState(batchResults.failure);
    this.dataGridController.dataGridApi.setRowSelectionModel([]);
    this.dataGridController.alertBarController.success("Phone Numbers have been successfully created.");
  }

  async handleOnUpdate(accessToken: string, recordsToUpdate: Array<PhoneNumberRecordType>): Promise<void> {
    const matchingRecordMessages = generateMatchingRecordMessages(this.dataGridController.sourceRecords, recordsToUpdate, pkeyFilter);

    if (matchingRecordMessages && matchingRecordMessages.length > 0) {
      this.dataGridController.alertBarController.error(matchingRecordMessages.join("\n"));
      return;
    }

    const batchResults = await BatchPhoneNumberRecord.update(accessToken, recordsToUpdate);

    if (batchResults?.hasError) {
      this.dataGridController.alertBarController.error("Error while updating the records. ".concat(batchResults.alertMsg));
      return;
    }

    this.dataGridController.alertBarController.success("Call Flow Rules have been successfully updated.");

    await deleteOppositeRows(accessToken, batchResults.success);

    this.dataGridController.setSelectedRecordsState(batchResults.failure);

    this.dataGridController.updateRecordsInSourceRecords(batchResults.success);
    this.dataGridController.dataGridApi.setRowSelectionModel(batchResults.failure.map<number>(phoneNumberRecord => phoneNumberRecord.id));
    this.dataGridController.dataGridFilter.applyFilter();
  }

  async handleOnDelete(accessToken: string, recordsToDelete: Array<PhoneNumberRecordType>): Promise<void> {
    const batchResults = await BatchPhoneNumberRecord.delete(accessToken, recordsToDelete);

    if(batchResults?.hasError) {
      this.dataGridController.alertBarController.error(batchResults.alertMsg);
      return;
    } else {
      this.dataGridController.alertBarController.success("Call Flow Rules have been successfully deleted.");
    }

    await deleteOppositeRows(accessToken, batchResults.success);

    this.dataGridController.setSelectedRecordsState(batchResults.failure);
    this.dataGridController.removeRecordsFromSourceRecords(batchResults.success);
    this.dataGridController.dataGridFilter.applyFilter();
    this.dataGridController.setDataGridPropsState({ fetching: false });
    this.dataGridController.dataGridApi.setRowSelectionModel(batchResults.failure.map<number>(phoneNumberRecord => phoneNumberRecord.id));
  }
}

