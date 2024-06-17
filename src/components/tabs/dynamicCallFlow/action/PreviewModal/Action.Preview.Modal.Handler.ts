import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import {
  AbstractPreviewModalHandler, HANDLED_SUCCESSFULLY,
  HANDLED_UNSUCCESSFULLY
} from "../../common/Preview/Abstract.Preview.Modal.Handler";
import { batchCreateDynamicActionRecords } from "../GraphQL/Batch.Create.Action.Records.Query";
import { batchDeleteDynamicActionRecords } from "../GraphQL/Batch.Delete.Action.Records.Query";

export class ActionPreviewModalHandler extends AbstractPreviewModalHandler<ActionRecordType> {

  async handleOnCreate(accessToken: string, newCallFlowConfigRecords: Array<ActionRecordType>): Promise<boolean> {
    if (newCallFlowConfigRecords?.length > 0) {
      const callFlowName = newCallFlowConfigRecords[0].callFlowName;
      const oldCallFlowConfigRecords = [ ...this.dataGridController.sourceRecords.filter(sourceRecord => sourceRecord.callFlowName === callFlowName) ];

      //Remove old call flow config records from the source records
      this.dataGridController.removeRecordsFromSourceRecords(oldCallFlowConfigRecords);

      const batchResults = await batchCreateDynamicActionRecords(accessToken, newCallFlowConfigRecords);

      if (batchResults?.hasError) {
        // if newCallFlowConfigRecords failed to create, add the old call flow config records back to the ActionDataGridComponent data grid
        this.dataGridController.addRecordsToSourceRecords(oldCallFlowConfigRecords);

        return HANDLED_UNSUCCESSFULLY;
      } else {
        this.dataGridController.addRecordsToSourceRecords(newCallFlowConfigRecords);

        // if newCallFlowConfigRecords were successfully created, remove the old call flow config records from the source records that weren't part of the new call flow config records
        const oldCallFlowConfigRecordsToDelete =
          oldCallFlowConfigRecords.filter(oldCallFlowConfigRecord =>
            !newCallFlowConfigRecords.find(newCallFlowConfigRecord => oldCallFlowConfigRecord.id === newCallFlowConfigRecord.id));

        if (oldCallFlowConfigRecordsToDelete.length > 0) {
          const deleteActionsBatchResults = await batchDeleteDynamicActionRecords(accessToken, oldCallFlowConfigRecordsToDelete);

          if (deleteActionsBatchResults?.hasError) {
            this.dataGridController.alertBarController.error("Failed to delete old call flow config records.  Check logs and reload Call Flow Config Actions again.  Call Flow Config could be corrupt and fail.");
            this.dataGridController.removeRecordsFromSourceRecords(newCallFlowConfigRecords);
            this.dataGridController.addRecordsToSourceRecords(oldCallFlowConfigRecordsToDelete);
            return HANDLED_UNSUCCESSFULLY;

          }
        }
      }
    }

    return HANDLED_SUCCESSFULLY;
  }

  async handleOnDelete(accessToken: string, recordsToDelete: Array<ActionRecordType>): Promise<boolean> {
    if (recordsToDelete?.length !== 0) {
      const batchResults = await this.runBatch(accessToken, recordsToDelete, batchDeleteDynamicActionRecords,
        this.dataGridController.removeRecordsFromDataGrid);

      return batchResults?.hasError ? HANDLED_UNSUCCESSFULLY : HANDLED_SUCCESSFULLY;
    }

    return HANDLED_SUCCESSFULLY;
  }
}

