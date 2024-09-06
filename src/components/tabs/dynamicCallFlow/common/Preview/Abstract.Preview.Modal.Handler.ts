// export interface DataGridController<RecordType> {
//   set
// }
import { DataGridController, DataGridControllerRef } from "../../common/DataGrid/Abstract.DataGrid.Controller";

export const HANDLED_SUCCESSFULLY = true;
export const HANDLED_UNSUCCESSFULLY = false;

export interface PreviewModalHandler<RecordType> {
  handleOnCreate(accessToken: string, recordsToCreate: Array<RecordType>): Promise<boolean>;
  handleOnDelete(accessToken: string, recordsToDelete: Array<RecordType>): Promise<boolean>;
}

export abstract class AbstractPreviewModalHandler<RecordType> implements PreviewModalHandler<RecordType> {
  protected readonly _dataGridController: DataGridControllerRef<RecordType>;

  constructor(dataGridController: DataGridControllerRef<RecordType>) {
    this._dataGridController = dataGridController;
  }

  protected get dataGridController(): DataGridController<RecordType> {
    return this._dataGridController.current;
  }

  abstract handleOnCreate(accessToken: string, recordsToCreate: Array<RecordType>): Promise<boolean>;
  abstract handleOnDelete(accessToken: string, recordsToDelete: Array<RecordType>): Promise<boolean>;
}

