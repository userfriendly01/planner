import { PreviewModalActionType } from "../Preview/Preview.Interface";
import { AbstractReactState } from "../StateManager/Abstract.ReactState";
import { Filter } from "./Abstract.DataGrid.Filter.Modal.Manager";

export interface DataGridStateProps<RecordType> {
  data?: Array<RecordType>;
  filteredData?: Array<RecordType>;
  selectedList?: Array<RecordType>;
  fetching?: boolean;
  selectedRow?: RecordType;
  previewModalAction?: PreviewModalActionType;
  isAddModalOpen?: boolean;
  isFormEditModalOpen?: boolean;
  isEditModalOpen?: boolean;
  isFormAddModalOpen?: boolean;
  isFilterModalOpen?: boolean;
  isPreviewModalOpen?: boolean;
  idStart?: number;
  idEnd?: number;
  maxId?: number;
  minId?: number;
  saveSuccess?: boolean;
}

export function initializeDataGrid<RecordType>(): DataGridStateProps<RecordType> {
  return {
    data: [],
    selectedList: {} as Array<RecordType>,
    filteredData: [],
    filter: {} as Filter,
    fetching: true,
    selectedRow: undefined,
    isEditModalOpen: false,
    isPreviewModalOpen: false,
    isAddModalOpen: false,
    isFormEditModalOpen: false,
    isFormAddModalOpen: false,
    isFilterModalOpen: false,
    idStart: 0,
    idEnd: 0,
    maxId: 0,
    minId: 0,
    saveSuccess: false
  } as DataGridStateProps<RecordType>;
}

export class DataGridState<RecordType> extends AbstractReactState<DataGridStateProps<RecordType>> {
  addRecordToData(record: RecordType): DataGridState<RecordType> {
    this.state.data.push(record);

    return this as DataGridState<RecordType>;
  }

  addRecordToFilteredData(record: RecordType): DataGridState<RecordType>  {
    this.state.data.push(record);

    return this as DataGridState<RecordType>;
  }

  setData(newData: Array<RecordType>): DataGridState<RecordType> {
    this.state.data = newData;

    return this as DataGridState<RecordType>;
  }

  get data(): Array<RecordType> {
    return this.state.data;
  }

  setFilteredData(filteredData: Array<RecordType>): DataGridState<RecordType> {
    this.state.filteredData = filteredData;

    return this as DataGridState<RecordType>;
  }

  get selectedList(): Array<RecordType> {
    return this.state.selectedList;
  }

  setSelectedList(selectedList: Array<RecordType>): DataGridState<RecordType> {
    this.state.selectedList = selectedList;

    return this;
  }

  get filteredData(): Array<RecordType> {
    return this.state.filteredData;
  }

  setFetching(fetching: boolean): DataGridState<RecordType> {
    this.state.fetching = fetching;

    return this as DataGridState<RecordType>;
  }

  get fetching(): boolean {
    return this.state.fetching;
  }

  setSelectedRow(selectedRow: RecordType): DataGridState<RecordType> {
    this.state.selectedRow = selectedRow;

    return this as DataGridState<RecordType>;
  }

  get selectedRow(): RecordType {
    return this.state.selectedRow;
  }

  setIsEditModalOpen(isEditModalOpen: boolean): DataGridState<RecordType> {
    this.state.isEditModalOpen = isEditModalOpen;

    return this as DataGridState<RecordType>;
  }

  get isEditModalOpen(): boolean {
    return this.state.isEditModalOpen;
  }

  setIsPreviewModalOpen(openPreviewModal: boolean): DataGridState<RecordType> {
    this.state.isPreviewModalOpen = openPreviewModal;

    return this as DataGridState<RecordType>;
  }

  get isPreviewModalOpen(): boolean {
    return this.state.isPreviewModalOpen;
  }

  setPreviewModalAction(previewModalAction: PreviewModalActionType): DataGridState<RecordType> {
    this.state.previewModalAction = previewModalAction;

    return this as DataGridState<RecordType>;
  }

  get previewModalAction(): PreviewModalActionType {
    return this.state.previewModalAction;
  }

  setIsAddDynamicPhoneNumberModalOpen(isAddDynamicPhoneNumberModalOpen: boolean): DataGridState<RecordType> {
    this.state.isAddModalOpen = isAddDynamicPhoneNumberModalOpen;

    return this as DataGridState<RecordType>;
  }

  get isAddDynamicPhoneNumberModalOpen(): boolean {
    return this.state.isFormEditModalOpen;
  }

  setIsFormEditModalOpen(isFormEditModalOpen: boolean): DataGridState<RecordType> {
    this.state.isFormEditModalOpen = isFormEditModalOpen;

    return this as DataGridState<RecordType>;
  }

  get isFormEditModalOpen(): boolean {
    return this.state.isFormEditModalOpen;
  }

  setIsAddModalOpen(isAddModalOpen: boolean): DataGridState<RecordType> {
    this.state.isAddModalOpen = isAddModalOpen;

    return this as DataGridState<RecordType>;
  }

  get isAddModalOpen(): boolean {
    return this.state.isAddModalOpen;
  }

  setIsFilterModalOpen(isFilterModalOpen: boolean): DataGridState<RecordType> {
    this.state.isFilterModalOpen = isFilterModalOpen;

    return this as DataGridState<RecordType>;
  }

  get isFilterModalOpen(): boolean {
    return this.state.isFilterModalOpen;
  }

  setIdStart(idStart: number): DataGridState<RecordType> {
    this.state.idStart = idStart;

    return this as DataGridState<RecordType>;
  }

  get idStart(): number {
    return this.state.idStart;
  }

  setIdEnd(idEnd: number): DataGridState<RecordType> {
    this.state.idEnd = idEnd;

    return this as DataGridState<RecordType>;
  }

  get idEnd(): number {
    return this.state.idEnd;
  }

  setMinId(minId: number): DataGridState<RecordType> {
    this.state.minId = minId;

    return this as DataGridState<RecordType>;
  }

  get minId(): number {
    return this.state.minId;
  }

  setMaxId(maxId: number): DataGridState<RecordType> {
    this.state.maxId;

    return this as DataGridState<RecordType>;
  }

  get maxId(): number {
    return this.state.maxId;
  }

  setSaveSuccess(saveSuccess: boolean): DataGridState<RecordType> {
    this.state.saveSuccess = saveSuccess;

    return this as DataGridState<RecordType>;
  }

  get saveSuccess(): boolean {
    return this.state.saveSuccess;
  }
}