import { DataGridStateProps } from "./DynamicCallFlow.Common.DataGrid";
import {
  AlertBarControllerRef, DataGridFilterRef,
  ReactGridApi, ReactSetState
} from "../Container.Interfaces";
import { AlertBarController } from "../AlertBar";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { DataGridFilter } from "./Abstract.DataGrid.Filter";

/**
 * @typedef {RecordType} RecordType
 */

const RECORD_NOT_FOUND = -1;
const KEEP_EXISTING_RECORD = true;
const REMOVE_EXISTING_RECORD = false;

export interface DataGridController<RecordType> {
  get dataGridApi(): GridApiCommunity;
  get dataGridFilter(): DataGridFilter<RecordType>;
  get alertBarController(): AlertBarController;
  set dataGridProps(dataGridProps: DataGridStateProps);
  get dataGridProps(): DataGridStateProps;
  setDataGridPropsState(dataGridProps: DataGridStateProps): void;
  set sourceRecords(sourceRecords: Array<RecordType>);
  get sourceRecords(): Array<RecordType>;
  setSourceRecordsState(sourceRecords: Array<RecordType>): void;
  addRecordToSourceRecords(recordToAdd: RecordType): void;
  addRecordsToSourceRecords(recordsToAdd: Array<RecordType>): void;
  updateRecordInSourceRecords(recordToUpdate: RecordType): void;
  updateRecordsInSourceRecords(recordsToUpdate: Array<RecordType>): void;
  removeRecordFromSourceRecords(recordToUpdate: RecordType): void;
  removeRecordsFromSourceRecords(recordToUpdate: Array<RecordType>): void;
  set dataGridRecords(dataGridRecords: Array<RecordType>);
  get dataGridRecords(): Array<RecordType>;
  setDataGridRecordsState(dataGridRecords: Array<RecordType>): void;
  addRecordToDataGrid(recordToAdd: RecordType): void;
  addRecordsToDataGrid(recordsToAdd: Array<RecordType>): void;
  updateRecordInDataGrid(recordToUpdate: RecordType): void;
  updateRecordsInDataGrid(recordsToAdd: Array<RecordType>): void;
  removeRecordFromDataGrid(recordToRemove: RecordType): void;
  removeRecordsFromDataGrid(recordsToRemove: Array<RecordType>): void;
  set selectedRecord(selectedRecord: RecordType);
  setSelectedRecordState(selectedRecord: RecordType): void;
  set selectedRecords(selectedRecords: Array<RecordType>);
  get selectedRecords(): Array<RecordType>;
  setSelectedRecordsState(selectedRecords: Array<RecordType>): void;
}

export abstract class AbstractDataGridController<RecordType> implements DataGridController<RecordType> {
  private readonly _dataGridApi: ReactGridApi;
  private _dataGridProps: DataGridStateProps;
  private _dataGridFilter: DataGridFilterRef<RecordType>;
  private readonly _alertBarController: AlertBarControllerRef;
  private readonly _setDataGridProps: ReactSetState<DataGridStateProps>;
  private _sourceRecords: Array<RecordType>;
  private readonly _setSourceRecords: ReactSetState<Array<RecordType>>;
  private _dataGridRecords: Array<RecordType>;
  private readonly _setDataGridRecords:  ReactSetState<Array<RecordType>>;
  private _selectedRecord: RecordType;
  private readonly _setSelectedRecord:  ReactSetState<RecordType>;
  private _selectedRecords: Array<RecordType>;
  private readonly _setSelectedRecords:  ReactSetState<Array<RecordType>>;

  protected abstract recordKey(): string;

  constructor(dataGridApi: ReactGridApi, dataGridFilter: DataGridFilterRef<RecordType>, setDataGridProps: ReactSetState<DataGridStateProps>,
    alertBarController: AlertBarControllerRef, setSourceRecords: ReactSetState<Array<RecordType>>, setDataGridRecords: ReactSetState<Array<RecordType>>,
    setSelectedRecord: ReactSetState<RecordType>, setSelectedRecords: ReactSetState<Array<RecordType>>) {

    this._dataGridApi = dataGridApi;
    this._dataGridFilter = dataGridFilter;
    this._setDataGridProps = setDataGridProps;
    this._alertBarController = alertBarController;
    this._setSourceRecords = setSourceRecords;
    this._setDataGridRecords = setDataGridRecords;
    this._setSelectedRecord = setSelectedRecord;
    this._setSelectedRecords = setSelectedRecords;
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
    this._dataGridProps = dataGridProps;
  }

  get dataGridProps(): DataGridStateProps {
    return this._dataGridProps;
  }

  setDataGridPropsState(updatedDataGridProps: DataGridStateProps): void {
    this._setDataGridProps(previousState => ({
      ...previousState,
      ...updatedDataGridProps
    }));
  }

  // **************** sourceRecords Functions **************** //
  /**
   * ****** THIS DOES NOT UPDATE THE REACT STATE! ******
   * This sets the reference to the React state for sourceRecords,but does not update the state!
   * The subsequent functions call this._setSourceRecords will update the React state for sourceRecords.
   * @param {Array<RecordType>} sourceRecords
   */
  set sourceRecords(sourceRecords: Array<RecordType>) {
    this._sourceRecords = sourceRecords;
  }

  get sourceRecords(): Array<RecordType> {
    return this._sourceRecords;
  }

  setSourceRecordsState(sourceRecords: Array<RecordType>): void {
    this._setSourceRecords(sourceRecords);
  }

  addRecordToSourceRecords(recordToAdd: RecordType): void {
    this._setSourceRecords( previousRecordsState => this._addRecordToPreviousStateRecordArray(recordToAdd, previousRecordsState));
  }

  addRecordsToSourceRecords(recordsToAdd: Array<RecordType>): void {
    this._setSourceRecords( previousRecordsState => [ ...previousRecordsState, ...recordsToAdd ]);
  }

  updateRecordInSourceRecords(updatedRecord: RecordType): void {
    this._setSourceRecords( previousRecordsState => this._updateRecordInPreviousRecordsState(updatedRecord, previousRecordsState));
  }

  updateRecordsInSourceRecords(updatedRecords: Array<RecordType>): void {
    this._setSourceRecords( previousRecordsState => this._updateRecordsInPreviousRecordsState(updatedRecords, previousRecordsState));
  }

  removeRecordFromSourceRecords(recordToRemove: RecordType): void {
    this._setSourceRecords( previousRecordsState => this._removeRecordFromPreviousRecordsState(recordToRemove, previousRecordsState));
  }

  removeRecordsFromSourceRecords(recordsToRemove: Array<RecordType>): void {
    this._setSourceRecords( previousRecordsState => this._removeRecordsFromPreviousRecordsState(recordsToRemove, previousRecordsState));
  }

  // **************** dataGridRecords Functions **************** //
  /**
   * ****** THIS DOES NOT UPDATE THE REACT STATE! ******
   * This sets the reference to the React state for dataGridRecords, but does not update the state!
   * The subsequent functions call this._setDataGridRecords will update the React state for dataGridRecords.
   * @param {Array<RecordType>} dataGridRecords
   */
  set dataGridRecords(dataGridRecords: Array<RecordType>) {
    this._dataGridRecords = dataGridRecords;
  }

  get dataGridRecords(): Array<RecordType> {
    return this._dataGridRecords;
  }

  setDataGridRecordsState(dataGridRecords: Array<RecordType>): void {
    this._setDataGridRecords(dataGridRecords);
  }

  addRecordToDataGrid(recordToAdd: RecordType): void {
    this._setDataGridRecords( previousRecordsState => this._addRecordToPreviousStateRecordArray(recordToAdd, previousRecordsState));
  }

  addRecordsToDataGrid(recordsToAdd: Array<RecordType>): void {
    this._setDataGridRecords( previousRecordsState => [ ...previousRecordsState, ...recordsToAdd ]);
  }

  updateRecordInDataGrid(updatedRecord: RecordType): void {
    this._setDataGridRecords( previousRecordsState => this._updateRecordInPreviousRecordsState(updatedRecord, previousRecordsState));
  }

  updateRecordsInDataGrid(updatedRecords: Array<RecordType>): void {
    this._setDataGridRecords( previousRecordsState => this._updateRecordsInPreviousRecordsState(updatedRecords, previousRecordsState));
  }

  removeRecordFromDataGrid(recordToRemove: RecordType): void {
    this._setDataGridRecords( previousRecordsState => this._removeRecordFromPreviousRecordsState(recordToRemove, previousRecordsState));
  }

  removeRecordsFromDataGrid(recordsToRemove: Array<RecordType>): void {
    this._setDataGridRecords( previousRecordsState => this._removeRecordsFromPreviousRecordsState(recordsToRemove, previousRecordsState));
  }

  // **************** selectedRecord Functions **************** //
  /**
   * ****** THIS DOES NOT UPDATE THE REACT STATE! ******
   * This sets the reference to the React state for selectedRecord, but does not update the state!
   * The subsequent functions call this._setSelectedRecord will update the React state for selectedRecord.
   * @param selectedRecord
   */
  set selectedRecord(selectedRecord: RecordType) {
    this._selectedRecord = selectedRecord;
  }

  get selectedRecord(): RecordType {
    return this._selectedRecord;
  }

  setSelectedRecordState(selectedRecord: RecordType): void {
    this._setSelectedRecord(selectedRecord);
  }

  // **************** selectedRecords Functions **************** //
  set selectedRecords(selectedRecords: Array<RecordType>) {
    this._selectedRecords = selectedRecords;
  }

  get selectedRecords(): Array<RecordType> {
    return this._selectedRecords;
  }

  setSelectedRecordsState(selectedRecords: Array<RecordType>): void {
    this._setSelectedRecords(selectedRecords);
  }

  // **************** Private Common Utility Functions **************** //
  private _addRecordToPreviousStateRecordArray(recordToAdd: RecordType, previousRecordsState: Array<RecordType>): Array<RecordType> {
    return [ ...previousRecordsState, recordToAdd ];
  }

  private _updateRecordInPreviousRecordsState(newRecord: RecordType, previousRecordsState: Array<RecordType>): Array<RecordType> {
    return previousRecordsState.map( existingRecord => existingRecord[this.recordKey() as keyof RecordType] === newRecord[this.recordKey() as keyof RecordType] ? newRecord : existingRecord);
  }

  private _updateRecordsInPreviousRecordsState(updatedRecords: Array<RecordType>, previousRecordsState: Array<RecordType>): Array<RecordType> {
    return previousRecordsState.map(existingRecord => {
      const updatedRecordIndex = updatedRecords.findIndex(updatedRecord => updatedRecord[this.recordKey() as keyof RecordType] === existingRecord[this.recordKey() as keyof RecordType]);

      //remove updatedRecord from updatedRecords array to speed up the find for future iterations by reducing recordsToRemove array size
      return updatedRecordIndex === RECORD_NOT_FOUND ? existingRecord : updatedRecords.splice(updatedRecordIndex, 1)[0];
    });
  }

  private _removeRecordFromPreviousRecordsState(recordToRemove: RecordType, previousRecordsState: Array<RecordType>): Array<RecordType> {
    return previousRecordsState.filter( existingRecord => existingRecord[this.recordKey() as keyof RecordType] !== recordToRemove[this.recordKey() as keyof RecordType]);
  }

  private _removeRecordsFromPreviousRecordsState(recordsToRemove: Array<RecordType>, previousRecordsState: Array<RecordType>): Array<RecordType> {
    return previousRecordsState.filter( existingRecord => {
      const recordToRemoveIndex = recordsToRemove.findIndex( recordToRemove => recordToRemove[this.recordKey() as keyof RecordType] === existingRecord[this.recordKey() as keyof RecordType]);

      if (recordToRemoveIndex === RECORD_NOT_FOUND) {
        return KEEP_EXISTING_RECORD;
      } else {
        //remove recordToRemove from recordsToRemove array to speed up the find for future iterations by reducing recordsToRemove array size
        recordsToRemove.splice(recordToRemoveIndex, 1);
        return REMOVE_EXISTING_RECORD;
      }
    });
  }
}