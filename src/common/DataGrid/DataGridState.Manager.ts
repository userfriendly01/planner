import {
  DataGridStateProps,
  Filter,
  PreviewModalActionType
} from "./DataGridState.Interfaces";
import { AbstractReactState } from "../StateManager/AbstractReactState.Manager";
import { useState } from "react";
import { DynamicCallFlowPhoneNumberMasterData } from "components";


export function initializeDataGrid<RecordType>(): DataGridStateProps<RecordType> {
  return {
    data: [],
    filteredData: [],
    filter: {} as Filter,
    fetching: true,
    selectedRow: undefined,
    isEditModalOpen: false,
    isPreviewModalOpen: false,
    isAddModalOpen: false,
    isFilterModalOpen: false,
    idStart: 0,
    idEnd: 0,
    maxId: 0,
    minId: 0,
    saveSuccess: 0
  };
}

export class DataGridState<RecordType> extends AbstractReactState<DataGridStateProps<RecordType>> {
  constructor() {
    super();
    const [stateAction, setStateAction] = useState<DataGridStateProps<RecordType>>(initializeDataGrid);

    this.stateAction = stateAction;
    this.setStateAction = setStateAction;
  }

  protected initialState(): DataGridStateProps<RecordType> {
    return initializeDataGrid();
  }

  setData(data: Array<RecordType>): DataGridState<RecordType> {
    return this.setProperty("data", data);
  }

  get data(): Array<RecordType> {
    return this.state.data;
  }

  setFilteredData(filteredData: Array<RecordType>): DataGridState<RecordType> {
    return this.setProperty("filteredData", filteredData);
  }

  get filteredData(): Array<RecordType> {
    return this.state.filteredData;
  }

  setFilter(recordFilter: Filter): DataGridState<RecordType> {
    this.setStateAction({
      filter: {
        ...this.state.filter,
        ...recordFilter
      }
    });

    return this;
  }

  get filter(): Filter {
    return this.state.filter;
  }

  setMasterData(masterData: DynamicCallFlowPhoneNumberMasterData): DataGridState<RecordType> {
    this.setStateAction({
      masterData: {
        ...this.state.masterData,
        ...masterData
      }
    });

    return this;
  }

  get masterData(): DynamicCallFlowPhoneNumberMasterData {
    return this.state.masterData;
  }

  setFetching(fetching: boolean): DataGridState<RecordType> {
    return this.setProperty("fetching", fetching);
  }

  get fetching(): boolean {
    return this.state.fetching;
  }

  setSelectedRow(selectedRow: RecordType): DataGridState<RecordType> {
    return this.setProperty("selectedRow", selectedRow);
  }

  get selectedRow(): RecordType {
    return this.state.selectedRow;
  }

  setIsEditModalOpen(isEditModalOpen: boolean): DataGridState<RecordType> {
    return this.setProperty("isEditModalOpen", isEditModalOpen);
  }

  get isEditModalOpen(): boolean {
    return this.state.isEditModalOpen;
  }

  setIsPreviewModalOpen(isPreviewModalOpen: boolean): DataGridState<RecordType> {
    return this.setProperty("isPreviewModalOpen", isPreviewModalOpen);
  }

  get isPreviewModalOpen(): boolean {
    return this.state.isPreviewModalOpen;
  }

  setPreviewModalAction(previewModalAction: PreviewModalActionType): DataGridState<RecordType> {
    return this.setProperty("previewModalAction", previewModalAction);
  }

  get previewModalAction(): PreviewModalActionType {
    return this.state.previewModalAction;
  }

  setIsAddModalOpen(isAddModalOpen: boolean): DataGridState<RecordType> {
    return this.setProperty("isAddModalOpen", isAddModalOpen);
  }

  get isAddModalOpen(): boolean {
    return this.state.isAddModalOpen;
  }

  setIsFilterModalOpen(isFilterModalOpen: boolean): DataGridState<RecordType> {
    return this.setProperty("isFilterModalOpen", isFilterModalOpen);
  }

  get isFilterModalOpen(): boolean {
    return this.state.isFilterModalOpen;
  }

  setIdStart(idStart: number): DataGridState<RecordType> {
    return this.setProperty("idStart", idStart);
  }

  get idStart(): number {
    return this.state.idStart;
  }

  setIdEnd(idEnd: number): DataGridState<RecordType> {
    return this.setProperty("idEnd", idEnd);
  }

  get idEnd(): number {
    return this.state.idEnd;
  }

  setMinId(minId: number): DataGridState<RecordType> {
    return this.setProperty("minId", minId);
  }

  get minId(): number {
    return this.state.minId;
  }

  setMaxId(maxId: number): DataGridState<RecordType> {
    return this.setProperty("maxId", maxId);
  }

  get maxId(): number {
    return this.state.maxId;
  }

  //TODO: Should this be boolean?
  setSaveSuccess(saveSuccess: number): DataGridState<RecordType> {
    return this.setProperty("saveSuccess", saveSuccess);
  }

  get saveSuccess(): number {
    return this.state.saveSuccess;
  }
}