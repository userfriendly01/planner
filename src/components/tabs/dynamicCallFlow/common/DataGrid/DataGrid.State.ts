import { PreviewModalActionType } from "./DataGridState.Interfaces";
import { AbstractReactState } from "../StateManager/AbstractReact.State";

export interface Filter {
  [key: string]: string | number | boolean | Array<string | number | boolean> | undefined | null | Record<string, any> | Record<string, any>[];
}

export interface DataGridStateProps<RecordType> {
  data?: Array<RecordType>;
  filteredData?: Array<RecordType>;
  filter?: Filter;
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
  saveSuccess?: number;
}

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
    isFormEditModalOpen: false,
    isFormAddModalOpen: false,
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
    super(initializeDataGrid());
  }

  addRecordToData(record: RecordType): void {
    this._setState((prevState: DataGridStateProps<RecordType>) => {
      return {
        ...prevState,
        data: [...prevState.data, record]
      };
    });
  }

  addRecordToFilteredData(record: RecordType): void {
    this._setState((prevState: DataGridStateProps<RecordType>) => {
      return {
        ...prevState,
        filteredData: [...prevState.filteredData, record]
      };
    });
  }

  set data(data: Array<RecordType>) {
    this.setProperty("data", data);
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
    this.state = {
      filter: {
        ...this.state.filter,
        ...recordFilter
      }
    };

    return this;
  }

  get filter(): Filter {
    return this.state.filter;
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

  setIsPreviewModalOpen(openPrivewModal: boolean): DataGridState<RecordType> {
    return this.setProperty("isPreviewModalOpen", openPrivewModal);
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

  setIsAddDynamicPhoneNumberModalOpen(isAddDynamicPhoneNumberModalOpen: boolean): DataGridState<RecordType> {
    return this.setProperty("isAddDynamicPhoneNumberModalOpen", isAddDynamicPhoneNumberModalOpen);
  }

  get isAddDynamicPhoneNumberModalOpen(): boolean {
    return this.state.isFormEditModalOpen;
  }

  setIsFormEditModalOpen(isFormEditModalOpen: boolean): DataGridState<RecordType> {
    return this.setProperty("isFormEditModalOpen", isFormEditModalOpen);
  }

  get isFormEditModalOpen(): boolean {
    return this.state.isFormEditModalOpen;
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