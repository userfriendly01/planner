import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import {
  AbstractPreviewModalHandler, HANDLED_SUCCESSFULLY,
  HANDLED_UNSUCCESSFULLY
} from "../../common/Preview/Abstract.Preview.Modal.Handler";
import { batchCreateDynamicActionRecords } from "../GraphQL/Batch.Create.Action.Records.Query";
import { batchDeleteDynamicActionRecords } from "../GraphQL/Batch.Delete.Action.Records.Query";
import { CallFlowDeleteResponse } from "dynamicCallFlow/GraphQL/Dynamic.PhoneNumber.Interfaces";

export class ActionPreviewModalHandler extends AbstractPreviewModalHandler<ActionRecordType, CallFlowDeleteResponse> {

  async handleOnCreate(accessToken: string, newCallFlowConfigRecords: Array<ActionRecordType>): Promise<boolean> {
    if (newCallFlowConfigRecords?.length > 0) {
      const callFlowName = newCallFlowConfigRecords[0].callFlowName;
      const oldCallFlowConfigRecords = [ ...this._dataGridController.current.sourceRecords.filter(record => record.callFlowName === callFlowName) ];

      //Remove old call flow config records from the source records
      this._dataGridController.current.removeRecordsFromSourceRecords(oldCallFlowConfigRecords);

      const batchResults = await batchCreateDynamicActionRecords(accessToken, newCallFlowConfigRecords);

      if (batchResults?.hasError) {
        // if newCallFlowConfigRecords failed to create, add the old call flow config records back to the ActionDataGridComponent data grid
        this._dataGridController.current.addRecordsToSourceRecords(oldCallFlowConfigRecords);

        return HANDLED_UNSUCCESSFULLY;
      } else {
        this._dataGridController.current.addRecordsToSourceRecords(newCallFlowConfigRecords);

        // if newCallFlowConfigRecords were successfully created, remove the old call flow config records from the source records that weren't part of the new call flow config records
        const oldCallFlowConfigRecordsToDelete =
          oldCallFlowConfigRecords.filter(oldCallFlowConfigRecord =>
            !newCallFlowConfigRecords.find(newCallFlowConfigRecord => oldCallFlowConfigRecord.id === newCallFlowConfigRecord.id));

        if (oldCallFlowConfigRecordsToDelete.length > 0) {
          const deleteActionsBatchResults = await batchDeleteDynamicActionRecords(accessToken, oldCallFlowConfigRecordsToDelete);

          if (deleteActionsBatchResults?.hasError) {
            this._dataGridController.current.alertBarController.error("Failed to delete old call flow config records.  Check logs and reload Call Flow Config Actions again.  Call Flow Config could be corrupt and fail.");
            this._dataGridController.current.removeRecordsFromSourceRecords(newCallFlowConfigRecords);
            this._dataGridController.current.addRecordsToSourceRecords(oldCallFlowConfigRecordsToDelete);
            return HANDLED_UNSUCCESSFULLY;

          }
        }
      }
    }

    return HANDLED_SUCCESSFULLY;
  }

  async handleOnUpdate(accessToken: string, recordsToUpdate: Array<ActionRecordType>): Promise<boolean> {
    throw new Error("handleOnUpdate not implemented for Dynamic Call Flow Action and it shouldn't be as those records are not updated, only created and deleted.");
  }

  async handleOnDelete(accessToken: string, recordsToDelete: Array<ActionRecordType>): Promise<boolean> {
    if (recordsToDelete?.length !== 0) {
      const batchResults = await this.runBatch(accessToken, recordsToDelete, batchDeleteDynamicActionRecords,
        this._dataGridController.current.removeRecordsFromDataGrid);

      return batchResults?.hasError ? HANDLED_UNSUCCESSFULLY : HANDLED_SUCCESSFULLY;
    }

    return HANDLED_SUCCESSFULLY;
  }
}

