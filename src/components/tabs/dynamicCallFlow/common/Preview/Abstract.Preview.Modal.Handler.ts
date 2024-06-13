// export interface DataGridController<RecordType> {
//   set
// }
import { DataGridControllerRef } from "../../common/DynamicCallFlow.Interfaces";
import { DataGridController } from "../../common/DataGrid/Abstract.DataGrid.Controller";
import {
  BatchRecordQuery, BatchResults
} from "../GraphQL/Abstract.BatchRecords.Query";

export type DataGridAction<RecordType> = (records: Array<RecordType>) => void;

export interface PreviewModalHandler<RecordType> {
  handleOnCreate(accessToken: string, recordsToCreate: Array<RecordType>): Promise<void>;
  handleOnUpdate(accessToken: string, recordsToUpdate: Array<RecordType>): Promise<void>;
  handleOnDelete(accessToken: string, recordsToDelete: Array<RecordType>): Promise<void>;
}

export abstract class AbstractPreviewModalHandler<RecordType> implements PreviewModalHandler<RecordType> {
  private readonly _dataGridController: DataGridControllerRef<RecordType>;

  constructor(dataGridController: DataGridControllerRef<RecordType>) {
    this._dataGridController = dataGridController;
  }

  protected get dataGridController(): DataGridController<RecordType> {
    return this._dataGridController.current;
  }

  abstract handleOnCreate(accessToken: string, recordsToCreate: Array<RecordType>): Promise<void>;
  abstract handleOnUpdate(accessToken: string, recordsToUpdate: Array<RecordType>): Promise<void>;
  abstract handleOnDelete(accessToken: string, recordsToDelete: Array<RecordType>): Promise<void>;

  protected async runBatch(accessToken: string, records: Array<RecordType>, batchRecordQuery: BatchRecordQuery<RecordType>,  dataGridAction: DataGridAction<RecordType>): Promise<BatchResults<RecordType>> {
    const batchResults = await batchRecordQuery(accessToken, records);

    if (batchResults?.hasError) {
      this.dataGridController.alertBarController.error(batchResults.alertMsg);
      return;
    }

    dataGridAction(batchResults.success);
    this.dataGridController.setSelectedRecordsState(batchResults.failure);
    this.dataGridController.dataGridApi.setRowSelectionModel(batchResults.failure.map<number>(record => record["id" as keyof RecordType] as number));
    this.dataGridController.dataGridFilter.applyFilter();
    this.dataGridController.setDataGridPropsState({ fetching: false });
    this.dataGridController.alertBarController.success("Action successfully completed.");

    return batchResults;
  }
}

