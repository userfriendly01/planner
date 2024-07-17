import { DataGridStateProps } from "components/tabs/dynamicCallFlow/common/DataGrid/DynamicCallFlow.Common.DataGrid";
import {
  AlertBarControllerRef,
  DataGridFilterRef,
  ReactGridApi
} from "components/tabs/dynamicCallFlow/common/DynamicCallFlow.Interfaces";
import { AlertBarController } from "components/tabs/dynamicCallFlow/common/AlertBar.Controller";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { DataGridFilter } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Filter";
import {
  addElementsToArray,
  addElementToArray,
  removeElementFromArray,
  removeElementsFromArray,
  updateElementInArray,
  updateElementsInArray
} from "components/tabs/dynamicCallFlow/common/Util/Array.Util";

/**
 * @typedef {RecordType} RecordType
 */

export interface DataGridController<RecordType> {
  get dataGridApi(): GridApiCommunity;
  get dataGridFilter(): DataGridFilter<RecordType>;
  get alertBarController(): AlertBarController;
  set dataGridProps(dataGridProps: DataGridStateProps);
  get dataGridProps(): DataGridStateProps;
  set sourceRecords(sourceRecords: Array<RecordType>);
  get sourceRecords(): Array<RecordType>;
  addRecordToSourceRecords(recordToAdd: RecordType): void;
  addRecordsToSourceRecords(recordsToAdd: Array<RecordType>): void;
  updateRecordInSourceRecords(recordToUpdate: RecordType): void;
  updateRecordsInSourceRecords(recordsToUpdate: Array<RecordType>): void;
  removeRecordFromSourceRecords(recordToUpdate: RecordType): void;
  removeRecordsFromSourceRecords(recordToUpdate: Array<RecordType>): void;
  set dataGridRecords(dataGridRecords: Array<RecordType>);
  get dataGridRecords(): Array<RecordType>;
  addRecordToDataGrid(recordToAdd: RecordType): void;
  addRecordsToDataGrid(recordsToAdd: Array<RecordType>): void;
  updateRecordInDataGrid(recordToUpdate: RecordType): void;
  updateRecordsInDataGrid(recordsToAdd: Array<RecordType>): void;
  removeRecordFromDataGrid(recordToRemove: RecordType): void;
  removeRecordsFromDataGrid(recordsToRemove: Array<RecordType>): void;
}

export abstract class AbstractDataGridController<RecordType> implements DataGridController<RecordType> {
  private readonly _dataGridApi: ReactGridApi;
  private readonly _dataGridFilter: DataGridFilterRef<RecordType>;
  private readonly _alertBarController: AlertBarControllerRef;
  private _sourceRecords: Array<RecordType> = [];
  private _dataGridProps: DataGridStateProps;
  private _dataGridRecords: Array<RecordType> = [];

  protected abstract recordKey(): string;

  constructor(dataGridApi: ReactGridApi, dataGridFilter: DataGridFilterRef<RecordType>, alertBarController: AlertBarControllerRef) {

    this._dataGridApi = dataGridApi;
    this._dataGridFilter = dataGridFilter;
    this._alertBarController = alertBarController;
  }

  get dataGridApi(): GridApiCommunity {
    return this._dataGridApi.current;
  }

  get dataGridFilter(): DataGridFilter<RecordType> {
    return this._dataGridFilter.current;
  }

  get alertBarController(): AlertBarController {
    return this._alertBarController.current;
  }

  // **************** dataGridProps Functions **************** //
  set dataGridProps(dataGridProps: DataGridStateProps) {
    this._dataGridProps = {
      ...this._dataGridProps,
      ...dataGridProps
    };
  }

  get dataGridProps(): DataGridStateProps {
    if (!this._dataGridProps) {
      throw Error("DataGridProps not initialized.");
    }

    return this._dataGridProps;
  }

  // **************** sourceRecords Functions **************** //
  set sourceRecords(sourceRecords: Array<RecordType>) {
    this._sourceRecords = sourceRecords;
  }

  get sourceRecords(): Array<RecordType> {
    return this._sourceRecords;
  }

  addRecordToSourceRecords(recordToAdd: RecordType): void {
    this._sourceRecords = addElementToArray<RecordType>(recordToAdd, this._sourceRecords);
  }

  addRecordsToSourceRecords(recordsToAdd: Array<RecordType>): void {
    this._sourceRecords = addElementsToArray<RecordType>(recordsToAdd, this._sourceRecords);
  }

  updateRecordInSourceRecords(updatedRecord: RecordType): void {
    this._sourceRecords = updateElementInArray<RecordType>(this.recordKey(), updatedRecord, this._sourceRecords);
  }

  updateRecordsInSourceRecords(updatedRecords: Array<RecordType>): void {
    this._sourceRecords = updateElementsInArray<RecordType>(this.recordKey(), updatedRecords, this._sourceRecords);
  }

  removeRecordFromSourceRecords(recordToRemove: RecordType): void {
    this._sourceRecords = removeElementFromArray<RecordType>(this.recordKey(), recordToRemove, this._sourceRecords);
  }

  removeRecordsFromSourceRecords(recordsToRemove: Array<RecordType>): void {
    this._sourceRecords = removeElementsFromArray<RecordType>(this.recordKey(), recordsToRemove, this._sourceRecords);
  }

  // **************** dataGridRecords Functions **************** //
  set dataGridRecords(dataGridRecords: Array<RecordType>) {
    this._dataGridRecords = dataGridRecords;
  }

  get dataGridRecords(): Array<RecordType> {
    return this._dataGridRecords;
  }

  addRecordToDataGrid(recordToAdd: RecordType): void {
    this._dataGridRecords = addElementToArray<RecordType>(recordToAdd, this._dataGridRecords);
  }

  addRecordsToDataGrid(recordsToAdd: Array<RecordType>): void {
    this._dataGridRecords = addElementsToArray<RecordType>(recordsToAdd, this._dataGridRecords);
  }

  updateRecordInDataGrid(updatedRecord: RecordType): void {
    this._dataGridRecords = updateElementInArray<RecordType>(this.recordKey(), updatedRecord, this._dataGridRecords);
  }

  updateRecordsInDataGrid(updatedRecords: Array<RecordType>): void {
    this._dataGridRecords = updateElementsInArray<RecordType>(this.recordKey(), updatedRecords, this._dataGridRecords);
  }

  removeRecordFromDataGrid(recordToRemove: RecordType): void {
    this._dataGridRecords = removeElementFromArray<RecordType>(this.recordKey(), recordToRemove, this._dataGridRecords);
  }

  removeRecordsFromDataGrid(recordsToRemove: Array<RecordType>): void {
    this._dataGridRecords = removeElementsFromArray<RecordType>(this.recordKey(), recordsToRemove, this._dataGridRecords);
  }
}
