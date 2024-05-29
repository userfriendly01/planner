import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumberRecord.Util";
import { listPhoneNumberRecords } from "../GraphQL/PhoneNumberListRecords.Util";
import { AbstractDataGridManager } from "../../common/DataGrid/AbstractDataGrid.Manager";
import {
  PreviewModalActionType
} from "../../common/DataGrid/DataGridState.Interfaces";
import {
  DataGridState, Filter
} from "../../common/DataGrid/DataGrid.State";
import { AlertBarState } from "../../common/StateManager/AlertBar.State";

export class PhoneNumberDataGridManager extends AbstractDataGridManager<PhoneNumberRecordType> {
  constructor(dataGridState: DataGridState<PhoneNumberRecordType>, alertBarState: AlertBarState) {
    super(dataGridState, alertBarState);
  }

  protected async retrieveData(accessToken: string): Promise<PhoneNumberRecordType[]> {
    return await listPhoneNumberRecords(accessToken);
  }

  protected getPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key);
  }

  // getMasterDataCacheKey(): string {
  //   return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_MASTER_DATA";
  // }
  //
  // protected getMasterDataFieldNames(): Array<string> {
  //   return [CHANNEL, BRAND, CALLER_TYPE, CALL_FLOW_TEMPLATE, CALL_FLOW_ROUTE, DATA_REQUESTS, PKEY];
  // }
  //
  // protected getMasterDataItemsWithList(): Array<string> {
  //   return [DATA_REQUESTS];
  // }

  getFilterCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_SEARCH_FILTER";
  }

  //TODO: remove the next two methods if not needed
  openAddDynamicPhoneNumberModal(): void {
    this.dataGrid.setIsAddDynamicPhoneNumberModalOpen(true);
  }

  closeAddDynamicPhoneNumberModal(): void {
    this.dataGrid.setIsAddDynamicPhoneNumberModalOpen(false);
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
    this.dataGrid.state = {
      isPreviewModalOpen: openPreviewModal,
      previewModalAction: previewModalAction
    };
  }
}