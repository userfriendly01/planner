import { PhoneNumberRecordType } from "../GraphQL/Dynamic.PhoneNumber.Interfaces";
import { listPhoneNumberRecords } from "../GraphQL/List.PhoneNumber.Records.Util";
import { AbstractDataGridComponentManager } from "../../common/DataGrid/Abstract.DataGrid.Component.Manager";
import {
  DataGridStateDeprecated
} from "../../common/DataGrid/DataGrid.State.Deprecated";
import { PreviewModalActionType } from "../../common/Preview/Preview.Interface";
import { AlertBarStateManager } from "../../common/StateManager/AlertBar.StateManager";
import { Filter } from "../../common/DataGrid/Abstract.DataGrid.Filter.Modal.Manager";
import { ReactSetState } from "../../common/StateManager/Abstract.ReactState";
import { GridPaginationModel } from "@mui/x-data-grid";

export class PhoneNumberDataGridComponentManager extends AbstractDataGridComponentManager<PhoneNumberRecordType> {

  constructor(dataGrid: DataGridStateDeprecated<PhoneNumberRecordType>, alertBar: AlertBarStateManager, setPaginationModel: ReactSetState<GridPaginationModel>) {
    super(dataGrid, alertBar, setPaginationModel);
  }

  protected dataGridPageNumberCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_PAGE_NUMBER";
  }

  protected dataGridRecordsPerPageCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_RECORDS_PER_PAGE";
  }

  protected async retrieveData(accessToken: string): Promise<PhoneNumberRecordType[]> {
    return await listPhoneNumberRecords(accessToken);
  }

  getFilterCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_SEARCH_FILTER";
  }

  openAddModal(openModel: boolean, isSubmitted?: boolean, phoneNumberRecord?: PhoneNumberRecordType) {
    const newData: Array<PhoneNumberRecordType> = [...this.dataGrid.data];
    const newFilteredItems: Array<PhoneNumberRecordType> = [...this.dataGrid.filteredData];

    if (!openModel && isSubmitted) {
      newData.push(phoneNumberRecord);
      newFilteredItems.push(phoneNumberRecord);
      this.alertBar.success("New call flow has been successfully added.", openModel);
    }

    if (!openModel && isSubmitted && phoneNumberRecord) {
      this.dataGrid.state = {
        data: newData,
        filteredData: newFilteredItems
      };
    }

    this.dataGrid.setIsAddModalOpen(openModel);
  }

  openFilterModal(openFilterModal: boolean, filter?: Filter): void {
    if (filter) {
      localStorage.setItem(this.getFilterCacheKey(), JSON.stringify(this.dataGrid?.filter));
      this.dataGrid.setFilter(filter);
    }

    this.dataGrid.setIsFilterModalOpen(openFilterModal);
  }

  openPreviewModal(openPreviewModal: boolean, previewModalAction: PreviewModalActionType): void {
    this.dataGrid
      .setIsPreviewModalOpen(openPreviewModal)
      .setPreviewModalAction(previewModalAction);
  }
}