import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/Util/PhoneNumberRecordUtil";
import { listPhoneNumberRecords } from "../GraphQL/Util/ListPhoneNumberRecordUtil";
import { AbstractDataGridManager } from "../../../../common/DataGrid/AbstractDataGrid.Manager";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS
} from "../Field/DynamicPhoneNumberFields";
import { PKEY } from "../Field/LegacyPhoneNumberFields";
import {
  Filter, PreviewModalActionType
} from "../../../../common/DataGrid/DataGridState.Interfaces";

export class PhoneNumberDataGridManager extends AbstractDataGridManager<PhoneNumberRecordType>{

  protected async retrieveData(accessToken: string): Promise<PhoneNumberRecordType[]> {
    return await listPhoneNumberRecords(accessToken);
  }

  protected getPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string | Array<string> | number | boolean | undefined {
    return PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key);
  }

  protected getMasterDataCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_MASTER_DATA";
  }

  protected getMasterDataItems(): Array<string> {
    return [CHANNEL, BRAND, CALLER_TYPE, CALL_FLOW_TEMPLATE, CALL_FLOW_ROUTE, DATA_REQUESTS, PKEY];
  }

  protected getMasterDataItemsWithList(): Array<string> {
    return [DATA_REQUESTS];
  }

  protected getFilterCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_SEARCH_FILTER";
  }

  openAddModal(flag: boolean, isSubmitted?: boolean, phoneNumberRecord?: PhoneNumberRecordType) {
    const newData: Array<PhoneNumberRecordType> = [...this.dataGrid.data];
    const newFilteredItems: Array<PhoneNumberRecordType> = [...this.dataGrid.filteredData];

    if (!flag && isSubmitted) {
      newData.push(phoneNumberRecord);
      newFilteredItems.push(phoneNumberRecord);
      this.alertBarState.success("New call flow has been successfully added.", flag);
    }

    if (!flag && isSubmitted && phoneNumberRecord) {
      this.dataGrid.setData(newData).setFilteredData(newFilteredItems);
    }

    this.dataGrid.setIsAddModalOpen(flag);
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

  // getAdvanceFilter(): PhoneNumberRecordType {
  //   try {
  //     const advanceFilter = (JSON.parse(localStorage.getItem(CACHE_FILTER_DYNAMIC_CALL_FLOW)) || {}) as PhoneNumberRecordType;
  //
  //     Object.keys(advanceFilter).forEach(key => {
  //       if (!advanceFilter[key as keyof PhoneNumberRecordType] || (typeof advanceFilter[key as keyof PhoneNumberRecordType] === "string" && (advanceFilter[key as keyof PhoneNumberRecordType] as string).trim() === "")) {
  //         delete advanceFilter[key as keyof PhoneNumberRecordType];
  //       }
  //     });
  //
  //     return advanceFilter;
  //   } catch (e) {
  //     console.error("Error in getting advance filter from local storage", e);
  //     return {} as PhoneNumberRecordType;
  //   }
  // }

  // filterRecords(phoneNumberRecords?: Array<PhoneNumberRecordType>, minId?: number, maxId?: number): void {
  //   let {
  //     data, idStart, idEnd
  //   } = this.dataGridState;
  //
  //   //TODO: Why set data, idStart, and idEnd and then reset it.
  //   if (phoneNumberRecords) {
  //     data = phoneNumberRecords;
  //     idStart = minId;
  //     idEnd = maxId;
  //   }
  //
  //   const filteredCallFlowRecords = data.filter(
  //     (phoneNumberRecord: PhoneNumberRecordType) => phoneNumberRecord.id >= idStart && phoneNumberRecord.id <= idEnd
  //   );
  //
  //   const advanceFilter = this.getAdvanceFilter();
  //
  //   if (Object.keys(advanceFilter).length > 0) {
  //     const filteredArray: Array<PhoneNumberRecordType> = [];
  //
  //     filteredCallFlowRecords.forEach(phoneNumberRecord => {
  //       let matched = 0;
  //
  //       Object.keys(advanceFilter).forEach(key => {
  //         // A call flow record property has matched one of the filters, increment matched
  //         matched += PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key) === advanceFilter[key as keyof PhoneNumberRecordType] ? 1 : 0;
  //       });
  //
  //       // If all elements in the filter have been matched to the call flow record, add it to the array of matched call flow records and exit the loop.
  //       if (Object.keys(advanceFilter).length === matched) {
  //         filteredArray.push(phoneNumberRecord);
  //         return;
  //       }
  //     });
  //
  //     this.dataGridState.setFilteredData(filteredArray)
  //       .setFilter(advanceFilter);
  //   } else {
  //     this.dataGridState.setFilteredData(filteredCallFlowRecords)
  //       .setFilter(advanceFilter);
  //   }
  // }
}