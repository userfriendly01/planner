import {
  DataGridState, Filter
} from "./DataGrid.State";
import { AlertBarState } from "../StateManager/AlertBar.State";
import {
  PhoneNumberRecordType
} from "../../phoneNumber/GraphQL/DynamicPhoneNumber.Interfaces";

const ID = "id";

export abstract class AbstractDataGridManager<T> {
  private readonly _dataGrid: DataGridState<T>;
  private readonly _alertBar: AlertBarState;

  constructor(dataGridState: DataGridState<T>, alertBarState: AlertBarState) {
    this._dataGrid = dataGridState;
    this._alertBar = alertBarState;
  }

  get dataGrid(): DataGridState<T> {
    return this._dataGrid;
  }

  get alertBar(): AlertBarState {
    return this._alertBar;
  }

  protected abstract retrieveData(accessToken: string): Promise<Array<T>>;

  protected abstract getPropertyValue(record: T, key: string): string | Array<string> | number | boolean | undefined;

  async loadDataGrid(accessToken: string): Promise<Array<PhoneNumberRecordType>> {
    this.alertBar.info("Data loading in progress. Please wait for the complete set of data to be loaded.");

    let records = await this.retrieveData(accessToken);

    if (records?.length > 0) {
      records = records.sort((a: T, b: T) => ((a[ID as keyof T] as number) - (b[ID as keyof T] as number)));
      records = records.map((record: T, index: number) => ({
        ...record,
        id: index + 1
      }));

      const minId: number = records[0][ID as keyof T] as number;
      const maxId: number = records[records.length - 1][ID as keyof T] as number;

      this.dataGrid.state = {
        data: records,
        filteredData: records,
        fetching: false,
        idStart: minId,
        idEnd: maxId,
        minId,
        maxId
      };

      if (Object.keys(this.getFilter()).length > 0) {
        this.filterRecords(records, minId, maxId);
      }

      this.alertBar.success("Successfully loaded the phone number data.");

      return records;
    } else {
      this.dataGrid.state = {
        data: records,
        filteredData: records,
        fetching: false
      };

      this.alertBar.error("Error in retrieving records. Please check the console log");
    }

    return [];
  }

  filterRecords(records?: Array<T>, minId?: number, maxId?: number): void {
    let {
      data, idStart, idEnd
    } = this.dataGrid;

    //TODO: Why set data, idStart, and idEnd and then reset it.
    if (records) {
      data = records;
      idStart = minId;
      idEnd = maxId;
    }

    const filteredRecords = data.filter(
      (record: T) => record[ID as keyof T] >= idStart && record[ID as keyof T]  <= idEnd
    );

    const filter = this.getFilter();

    if (Object.keys(filter).length > 0) {
      const filteredArray: Array<T> = [];

      filteredRecords.forEach(record => {
        let matched = 0;

        Object.keys(filter).forEach(key => {
          // A call flow record property has matched one of the filters, increment matched
          matched += this.getPropertyValue(record, key) === filter[key as keyof Filter] ? 1 : 0;
        });

        // If all elements in the filter have been matched to the call flow record, add it to the array of matched call flow records and exit the loop.
        if (Object.keys(filter).length === matched) {
          filteredArray.push(record);
          return;
        }
      });

      this.dataGrid.setFilteredData(filteredArray)
        .setFilter(filter);
    } else {
      this.dataGrid.setFilteredData(filteredRecords)
        .setFilter(filter);
    }
  }

  abstract getFilterCacheKey(): string;

  getFilter(): Filter {
    try {
      const filter = (JSON.parse(localStorage.getItem(this.getFilterCacheKey())) || {}) as Filter;

      Object.keys(filter).forEach(key => {
        if (!filter[key as keyof Filter] || (typeof filter[key as keyof Filter] === "string" && (filter[key as keyof T] as string).trim() === "")) {
          delete filter[key as keyof Filter];
        }
      });

      return filter;
    } catch (e) {
      console.error("Error in getting filter model from local storage", e);
      return {} as Filter;
    }
  }


}