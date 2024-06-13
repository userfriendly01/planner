// export interface DataGridController<RecordType> {
//   set
// }
import { ActionRecordType } from "../GraphQL/Action.Interfaces";
import { AbstractPreviewModalHandler } from "../../common/Preview/Abstract.Preview.Modal.Handler";
import {
  batchCreateDynamicActionRecords,
  batchUpdateDynamicActionRecords
} from "../GraphQL/Batch.Create.Action.Records.Query";
import { batchDeleteDynamicActionRecords } from "../GraphQL/Batch.Delete.Action.Records.Query";

export class ActionPreviewModalHandler extends AbstractPreviewModalHandler<ActionRecordType> {

  async handleOnCreate(accessToken: string, recordsToCreate: Array<ActionRecordType>): Promise<void> {
    await this.runBatch(accessToken, recordsToCreate, batchCreateDynamicActionRecords,
      this.dataGridController.addRecordsToDataGrid);
  }

  async handleOnUpdate(accessToken: string, recordsToUpdate: Array<ActionRecordType>): Promise<void> {
    await this.runBatch(accessToken, recordsToUpdate, batchUpdateDynamicActionRecords,
      this.dataGridController.updateRecordsInDataGrid);
  }

  async handleOnDelete(accessToken: string, recordsToDelete: Array<ActionRecordType>): Promise<void> {
    await this.runBatch(accessToken, recordsToDelete, batchDeleteDynamicActionRecords,
      this.dataGridController.removeRecordsFromDataGrid);
  }
}

