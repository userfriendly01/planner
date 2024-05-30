import {AbstractReactStateDeprecated, StateManager} from "../StateManager/AbstractReactStateDeprecated";
import {PreviewModalActionType} from "../Preview/Preview.Interface";
import {DataGridStateProps, initializeDataGrid} from "./DataGrid.State";
import {Filter} from "./Abstract.DataGrid.Filter.Modal.Manager";

export interface DataGridStateDeprecated<RecordType> extends StateManager<DataGridStateProps<RecordType>> {
  setProperty(key: string, value: any): void
  addRecordToData(record: RecordType): DataGridStateDeprecated<RecordType>;
  addRecordToFilteredData(record: RecordType): DataGridStateDeprecated<RecordType>;
  setData(newData: Array<RecordType>): DataGridStateDeprecated<RecordType>
  get data(): Array<RecordType>;
  setFilteredData(filteredData: Array<RecordType>): DataGridStateDeprecated<RecordType>;
  get filteredData(): Array<RecordType>;
  setFilter(filter: Filter): DataGridStateDeprecated<RecordType>;
  get filter(): Filter;
  setFetching(fetching: boolean): DataGridStateDeprecated<RecordType>;
  get fetching(): boolean;
  setSelectedRow(selectedRow: RecordType): DataGridStateDeprecated<RecordType>;
  get selectedRow(): RecordType;
  setIsEditModalOpen(isEditModalOpen: boolean): DataGridStateDeprecated<RecordType>;
  get isEditModalOpen(): boolean;
  setIsPreviewModalOpen(openPreviewModal: boolean): DataGridStateDeprecated<RecordType>;
  get isPreviewModalOpen(): boolean;
  setPreviewModalAction(previewModalAction: PreviewModalActionType): DataGridStateDeprecated<RecordType>;
  get previewModalAction(): PreviewModalActionType;
  setIsAddDynamicPhoneNumberModalOpen(isAddDynamicPhoneNumberModalOpen: boolean): DataGridStateDeprecated<RecordType>;
  get isAddDynamicPhoneNumberModalOpen(): boolean;
  setIsFormEditModalOpen(isFormEditModalOpen: boolean): DataGridStateDeprecated<RecordType>;
  get isFormEditModalOpen(): boolean;
  setIsAddModalOpen(isAddModalOpen: boolean): DataGridStateDeprecated<RecordType>;
  get isAddModalOpen(): boolean;
  setIsFilterModalOpen(isFilterModalOpen: boolean): DataGridStateDeprecated<RecordType>;
  get isFilterModalOpen(): boolean;
  setIdStart(idStart: number): DataGridStateDeprecated<RecordType>;
  get idStart(): number;
  setIdEnd(idEnd: number): DataGridStateDeprecated<RecordType>;
  get idEnd(): number;
  setMinId(minId: number): DataGridStateDeprecated<RecordType>;
  get minId(): number;
  setMaxId(maxId: number): DataGridStateDeprecated<RecordType>;
  get maxId(): number;
  setSaveSuccess(saveSuccess: boolean): DataGridStateDeprecated<RecordType>;
  get saveSuccess(): boolean;
}

export class DataGridStateOld<RecordType> extends AbstractReactStateDeprecated<DataGridStateProps<RecordType>> implements DataGridStateDeprecated<RecordType>{
  constructor() {
    super(initializeDataGrid());
  }

  addRecordToData(record: RecordType): DataGridStateDeprecated<RecordType> {
    this.state.data.push(record);

    return this as DataGridStateDeprecated<RecordType>;
  }

  addRecordToFilteredData(record: RecordType): DataGridStateDeprecated<RecordType>  {
    this.state.data.push(record);

    return this as DataGridStateDeprecated<RecordType>;
  }

  setData(newData: Array<RecordType>): DataGridStateDeprecated<RecordType> {
    this.state.data = newData;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get data(): Array<RecordType> {
    return this.state.data;
  }

  setFilteredData(filteredData: Array<RecordType>): DataGridStateDeprecated<RecordType> {
    this.state.filteredData = filteredData;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get filteredData(): Array<RecordType> {
    return this.state.filteredData;
  }

  setFilter(filter: Filter): DataGridStateDeprecated<RecordType> {
    this.state.filter = filter;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get filter(): Filter {
    return this.state.filter;
  }

  setFetching(fetching: boolean): DataGridStateDeprecated<RecordType> {
    this.state.fetching = fetching;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get fetching(): boolean {
    return this.state.fetching;
  }

  setSelectedRow(selectedRow: RecordType): DataGridStateDeprecated<RecordType> {
    this.state.selectedRow = selectedRow;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get selectedRow(): RecordType {
    return this.state.selectedRow;
  }

  setIsEditModalOpen(isEditModalOpen: boolean): DataGridStateDeprecated<RecordType> {
    this.state.isEditModalOpen = isEditModalOpen;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get isEditModalOpen(): boolean {
    return this.state.isEditModalOpen;
  }

  setIsPreviewModalOpen(openPreviewModal: boolean): DataGridStateDeprecated<RecordType> {
    this.state.isPreviewModalOpen = openPreviewModal;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get isPreviewModalOpen(): boolean {
    return this.state.isPreviewModalOpen;
  }

  setPreviewModalAction(previewModalAction: PreviewModalActionType): DataGridStateDeprecated<RecordType> {
    this.state.previewModalAction = previewModalAction;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get previewModalAction(): PreviewModalActionType {
    return this.state.previewModalAction;
  }

  setIsAddDynamicPhoneNumberModalOpen(isAddDynamicPhoneNumberModalOpen: boolean): DataGridStateDeprecated<RecordType> {
    this.state.isAddModalOpen = isAddDynamicPhoneNumberModalOpen;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get isAddDynamicPhoneNumberModalOpen(): boolean {
    return this.state.isFormEditModalOpen;
  }

  setIsFormEditModalOpen(isFormEditModalOpen: boolean): DataGridStateDeprecated<RecordType> {
    this.state.isFormEditModalOpen = isFormEditModalOpen;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get isFormEditModalOpen(): boolean {
    return this.state.isFormEditModalOpen;
  }

  setIsAddModalOpen(isAddModalOpen: boolean): DataGridStateDeprecated<RecordType> {
    this.state.isAddModalOpen = isAddModalOpen;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get isAddModalOpen(): boolean {
    return this.state.isAddModalOpen;
  }

  setIsFilterModalOpen(isFilterModalOpen: boolean): DataGridStateDeprecated<RecordType> {
    this.state.isFilterModalOpen = isFilterModalOpen;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get isFilterModalOpen(): boolean {
    return this.state.isFilterModalOpen;
  }

  setIdStart(idStart: number): DataGridStateDeprecated<RecordType> {
    this.state.idStart = idStart;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get idStart(): number {
    return this.state.idStart;
  }

  setIdEnd(idEnd: number): DataGridStateDeprecated<RecordType> {
    this.state.idEnd = idEnd;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get idEnd(): number {
    return this.state.idEnd;
  }

  setMinId(minId: number): DataGridStateDeprecated<RecordType> {
    this.state.minId = minId;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get minId(): number {
    return this.state.minId;
  }

  setMaxId(maxId: number): DataGridStateDeprecated<RecordType> {
    this.state.maxId;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get maxId(): number {
    return this.state.maxId;
  }

  setSaveSuccess(saveSuccess: boolean): DataGridStateDeprecated<RecordType> {
    this.state.saveSuccess = saveSuccess;

    return this as DataGridStateDeprecated<RecordType>;
  }

  get saveSuccess(): boolean {
    return this.state.saveSuccess;
  }
}