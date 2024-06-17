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

export class PhoneNumberPreviewModalHandler extends AbstractPreviewModalHandler<PhoneNumberRecordType> {
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

    const batchResults = await BatchPhoneNumberRecord.create(accessToken, recordsToCreate);

    if (batchResults?.hasError) {
      this.dataGridController.alertBarController.graphQLError(batchResults.errors);
      return HANDLED_UNSUCCESSFULLY;
    }

    const deleteOppositeRowsBatchResult = await deleteOppositeRows(accessToken, batchResults.success);

    if (deleteOppositeRowsBatchResult?.hasError) {
      this.dataGridController.alertBarController.graphQLError(deleteOppositeRowsBatchResult.errors);
      return HANDLED_UNSUCCESSFULLY;
    }

    this.dataGridController.addRecordsToSourceRecords(batchResults.success);
    this.dataGridController.dataGridFilter.applyFilter();

    this.dataGridController.setDataGridPropsState({ fetching: false });
    this.dataGridController.alertBarController.success("Phone Number Records successfully created.");

    return HANDLED_SUCCESSFULLY;
  }

  async handleOnDelete(accessToken: string, recordsToDelete: Array<PhoneNumberRecordType>): Promise<boolean> {
    const batchResults = await BatchPhoneNumberRecord.delete(accessToken, recordsToDelete);

    if (batchResults?.hasError) {
      this.dataGridController.alertBarController.error(batchResults.alertMsg);
      return HANDLED_UNSUCCESSFULLY;
    }

    this.dataGridController.removeRecordsFromSourceRecords(recordsToDelete);
    this.dataGridController.setDataGridPropsState({ fetching: false });
    this.dataGridController.alertBarController.success("Phone Numbers successfully deleted.");

    return HANDLED_SUCCESSFULLY;
  }
}