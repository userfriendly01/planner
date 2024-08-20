import {
  AbstractPreviewModalHandler, HANDLED_SUCCESSFULLY,
  HANDLED_UNSUCCESSFULLY
} from "components/tabs/dynamicCallFlow/common/Preview/Abstract.Preview.Modal.Handler";
import { PhoneNumberRecordType } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  dynamicAndLegacyPhoneNumberRecordFilter,
  generateMatchingRecordMessages
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Match.PhoneNumber.Records.Util";
import { BatchPhoneNumberRecord } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Batch.PhoneNumber.Records.Util";
import { deleteOppositeRows } from "components/tabs/dynamicCallFlow/phoneNumber/DataGrid/PhoneNumber.DataGrid.Util";

export class PhoneNumberPreviewModalHandler extends AbstractPreviewModalHandler<PhoneNumberRecordType> {
  //TODO: May need to check for matching records of the same record type since moving a phone number from legacy to dynamic is ok,
  // but creating a dynamic phone number record when a dynamic record already exists for that phone number is not ok.
  hasMatchingRecords(recordsToMatchOn: Array<PhoneNumberRecordType>): boolean {
    const matchingRecordMessages = generateMatchingRecordMessages(this.dataGridController.sourceRecords, recordsToMatchOn, dynamicAndLegacyPhoneNumberRecordFilter);

    if (matchingRecordMessages && matchingRecordMessages.length > 0) {
      this.dataGridController.alertBarController.error("Matching records found for: ".concat(matchingRecordMessages.join("\n")));
      return true;
    }

    return false;
  }

  async handleOnCreate(accessToken: string, phoneNumberRecords: Array<PhoneNumberRecordType>, logicalUpdateOperation = false): Promise<boolean> {
    // There is no batch update in DynamicDB, update & create call the same operation in the backend.  However, we need to check for matching records if a new record is actually being created.
    // If a record is being logically updated, we don't need to check for matching records.
    if (!logicalUpdateOperation && this.hasMatchingRecords(phoneNumberRecords)) {
      return HANDLED_UNSUCCESSFULLY;
    }

    const batchResults = await BatchPhoneNumberRecord.create(accessToken, phoneNumberRecords);

    if (batchResults?.hasError) {
      this.dataGridController.alertBarController.graphQLError(batchResults.errors);
      return HANDLED_UNSUCCESSFULLY;
    }

    // If a record is being logically updated, we don't need to delete the opposite rows.  If a record is being created, we need to delete the opposite rows if they exist.
    // Meaning, if we create a dynamic phone number record, the legacy phone number record needs to be deleted.
    if (!logicalUpdateOperation) {
      const deleteOppositeRowsBatchResult = await deleteOppositeRows(accessToken, phoneNumberRecords);

      if (deleteOppositeRowsBatchResult?.hasError) {
        this.dataGridController.alertBarController.graphQLError(deleteOppositeRowsBatchResult.errors);
        return HANDLED_UNSUCCESSFULLY;
      }
    }

    // if (logicalUpdateOperation) {
    //   const updatedRecords = phoneNumberRecords.map((updatedRecord: PhoneNumberRecordType) => ( { ...updatedRecord } ));
    //   this.dataGridController.updateRecordsInSourceRecords(updatedRecords);
    // } else {
    //   this.dataGridController.addRecordsToSourceRecords(phoneNumberRecords);
    // }

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
    this.dataGridController.alertBarController.success("Phone Numbers successfully deleted.");

    return HANDLED_SUCCESSFULLY;
  }
}
